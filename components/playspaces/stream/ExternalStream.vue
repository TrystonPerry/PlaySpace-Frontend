<template>
  <div>
    <StreamControls
      :stream="stream"
      :playerData="playerData"
      @play="playVideo"
      @pause="pauseVideo"
      @skipVideo="skipVideo"
      @timeChange="timeChange"
      @toggleFullscreen="toggleFullscreen"
      @updatePlayerData="updatePlayerData"
      :id="`${stream.id}-container`"
    >
      <div class="h-full w-full">
        <YoutubePlayer
          v-if="playerData.type === 'youtube'"
          :playerData="playerData"
          :stream="stream"
          @skipVideo="skipVideo"
          @updatePlayerData="updatePlayerData"
        />
        <DailyMotionPlayer
          v-if="playerData.type === 'dailymotion'"
          :playerData="playerData"
          :stream="stream"
          @skipVideo="skipVideo"
          @updatePlayerData="updatePlayerData"
        />
        <TwitchPlayer v-if="stream.type === 'twitch'" :stream="stream" />
      </div>
    </StreamControls>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

import StreamControls from "./StreamControls"

import YoutubePlayer from "./external/YoutubePlayer"
import DailyMotionPlayer from "./external/DailyMotionPlayer"
import TwitchPlayer from "./external/TwitchPlayer"

export default {
  components: {
    StreamControls,
    YoutubePlayer,
    DailyMotionPlayer,
    TwitchPlayer
  },

  props: {
    stream: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    // TODO temp, this is a temp solution
    skippedInLastSecond: false,
    playerData: {
      time: 0,
      duration: 0,
      activeVideoId: "",
      showVolume: false,
      volume: 50,
      isMuted: true,
      isFullscreen: false,
      type: ""
    }
  }),

  computed: {
    ...mapGetters({
      isAuthorized: "playSpace/isAuthorized"
    }),

    queueIds() {
      return Object.keys(this.stream.queue)
    },

    queue() {
      return Object.values(this.stream.queue)
    }
  },

  created() {
    this.playerData.activeVideoId = this.queue[0].videoId
    this.playerData.time = this.stream.time
    this.playerData.type = this.queue[0].type

    // TODO put this in its own function and depend on stream type
    // Get volume from localStorage
    const playerData = JSON.parse(localStorage.getItem("playspace-player"))
    if (playerData && playerData.youtube && playerData.youtube.volume) {
      this.playerData.volume = playerData.youtube.volume
    }
    this.playerData.isMuted = this.playerData.volume === 0

    // On new time
    this.sockets.SFU.subscribe(
      `room-stream-video-${this.stream.id}-player-time-update`,
      ({ time }) => {
        this.playerData.time = time
        this.setYouTubeVideoTime({ stream: this.stream, time })
      }
    )

    // On play
    this.sockets.SFU.subscribe(
      `room-stream-video-${this.stream.id}-played`,
      () => {
        this.setYouTubeVideoState({ state: 1, stream: this.stream })
      }
    )

    // On pause
    this.sockets.SFU.subscribe(
      `room-stream-video-${this.stream.id}-paused`,
      () => {
        this.setYouTubeVideoState({ state: 2, stream: this.stream })
      }
    )

    // Add new video to
    this.sockets.SFU.subscribe(
      `room-stream-video-${this.stream.id}-add-video`,
      ({ queueId, video }) => {
        this.addVideo(queueId, video)

        // If no videos in queue, load this video
        if (this.queue.length === 1) {
          this.loadVideo(queueId)
        }
      }
    )

    // On video skip
    this.sockets.SFU.subscribe(
      `room-stream-video-${this.stream.id}-skip-video`,
      queueId => {
        if (!this.queue.length) return

        const splicedQueueId = this.queueIds[0]

        this.removeVideoFromYouTubeQueue({ stream: this.stream, queueId })

        // If skipped currently playing video, play next video
        if (splicedQueueId === queueId && this.queueIds.length) {
          this.loadVideo(this.queueIds[0])
        }

        // If no more videos in queue
        else if (!this.queueIds.length) {
          this.setYouTubeVideoState({ state: 2, stream: this.stream })
          this.playerData.activeVideoId = ""
          this.playerData.type = ""
        }
      }
    )

    this.sockets.SFU.subscribe(
      `room-stream-external-${this.stream.id}-closed`,
      () => {
        this.removeStream({ type: "external", stream: this.stream })
      }
    )
  },

  methods: {
    ...mapActions({
      addVideoToYouTubeQueue: "stream/addVideoToYouTubeQueue",
      setYouTubeVideoState: "stream/setYouTubeVideoState",
      setYouTubeVideoTime: "stream/setYouTubeVideoTime",
      removeVideoFromYouTubeQueue: "stream/removeVideoFromYouTubeQueue",
      removeStream: "stream/removeStream"
    }),

    updatePlayerData(playerData) {
      // If volume changed
      if (playerData.volume !== this.playerData.volume) {
        localStorage.setItem(
          "playspace-player",
          JSON.stringify({
            youtube: { volume: Number(playerData.volume) }
          })
        )
      }
      Object.keys(playerData).forEach(key => {
        this.playerData[key] = playerData[key]
      })
    },

    addVideo(queueId, video) {
      this.addVideoToYouTubeQueue({ stream: this.stream, queueId, video })
      // If the queue was empty before this, play this video
      if (this.stream.queue.length === 1) {
        this.setYouTubeVideoState({ stream: this.stream, state: 1 })
      }
    },

    playVideo() {
      this.$socket.SFU.emit(`room-stream-video-play`, {
        id: this.stream.id,
        time: this.playerData.time || 0
      })
      this.setYouTubeVideoState({ state: 1, stream: this.stream })
    },

    pauseVideo() {
      this.$socket.SFU.emit(`room-stream-video-pause`, {
        id: this.stream.id,
        time: this.playerData.time || 0
      })
      this.setYouTubeVideoState({ state: 2, stream: this.stream })
    },

    skipVideo(queueId) {
      this.playerData.duration = 0
      this.$socket.SFU.emit(`room-stream-video-skip-video`, {
        id: this.stream.id,
        queueId
      })
    },

    loadVideo(queueId) {
      const video = this.stream.queue[queueId]
      if (!video) return
      this.playerData.type = ""
      this.playerData.activeVideoId = ""
      this.setYouTubeVideoState({ state: 1, stream: this.stream })
      this.setYouTubeVideoTime({ stream: this.stream, time: 0 })
      this.playerData.time = 0
      this.playerData.type = video.type
      this.playerData.activeVideoId = video.videoId
    },

    timeChange(event) {
      // TODO: throttle this function
      const time = Number(event.target.value)
      this.$socket.SFU.emit(`room-steam-video-player-time`, {
        id: this.stream.id,
        time
      })
    },

    toggleFullscreen() {
      // If is in fullscreen
      if (document.fullscreenElement) {
        document.exitFullscreen()
        this.playerData.isFullscreen = false
        return
      }
      // If not fullscreen
      document.getElementById(this.stream.id + "-container").requestFullscreen()
      this.playerData.isFullscreen = true
    }
  }
}
</script>

<style></style>
