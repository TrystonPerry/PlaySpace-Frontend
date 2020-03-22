<template>
  <StreamControls
    :stream="stream"
    :playerData="playerData"
    @skipVideo="skipVideo"
    @timeChange="timeChange"
    @toggleFullscreen="toggleFullscreen"
    @updatePlayerData="updatePlayerData"
    :id="`${stream.id}-container`"
  >
    <YoutubePlayer
      v-if="stream.type === 'youtube'"
      :playerData="playerData"
      :stream="stream"
      @skipVideo="skipVideo"
      @updatePlayerData="updatePlayerData"
    />
    <TwitchPlayer v-if="stream.type === 'twitch'" :stream="stream" />
  </StreamControls>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

import StreamControls from "./StreamControls"

import YoutubePlayer from "./external/YoutubePlayer"
import TwitchPlayer from "./external/TwitchPlayer"

export default {
  components: {
    StreamControls,
    YoutubePlayer,
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
      volume: 100,
      isMuted: true,
      isPaused: true,
      isFullscreen: false
    }
  }),

  computed: {
    ...mapGetters({
      isAuthorized: "playSpace/isAuthorized"
    })
  },

  created() {
    console.log({ ...this.stream })

    this.playerData.activeVideoId = this.stream.queue[0]

    // TODO put this in its own function and depend on stream type
    // Get volume from localStorage
    const playerData = JSON.parse(localStorage.getItem("playspace-player"))
    if (playerData && playerData[this.stream.type]) {
      this.playerData.volume = playerData[this.stream.type].volume
    }
    this.playerData.isMuted = this.playerData.volume === 0

    // On new time
    this.sockets.SFU.subscribe(
      `room-stream-youtube-${this.stream.id}-player-time-update`,
      ({ time }) => {
        this.playerData.time = time
        this.setYouTubeVideoTime({ stream: this.stream, time })
      }
    )

    // On play
    this.sockets.SFU.subscribe(
      `room-stream-youtube-${this.stream.id}-played`,
      () => {
        this.playerData.isPaused = false
        this.setYouTubeVideoState({ state: 1, stream: this.stream })
      }
    )

    // On pause
    this.sockets.SFU.subscribe(
      `room-stream-youtube-${this.stream.id}-paused`,
      () => {
        this.playerData.isPaused = true
        this.setYouTubeVideoState({ state: 2, stream: this.stream })
      }
    )

    // Add new video to
    this.sockets.SFU.subscribe(
      `room-stream-youtube-${this.stream.id}-add-video`,
      ({ videoId, video }) => {
        this.addVideo(videoId, video)

        // If no videos in queue before this
        if (this.stream.queue.length === 1) {
          this.loadVideo(videoId)
        }
      }
    )

    // On video skip
    this.sockets.SFU.subscribe(
      `room-stream-youtube-${this.stream.id}-skip-video`,
      index => {
        if (this.skippedInLastSecond) return

        this.skippedInLastSecond = true
        setTimeout(() => (this.skippedInLastSecond = false), 1000)

        this.removeVideoFromYouTubeQueue({ stream: this.stream, index })

        // If no more videos in queue
        if (!this.stream.queue.length) {
          this.playerData.isPaused = true
          this.setYouTubeVideoState({ state: 2, stream: this.stream })
          this.playerData.activeVideoId = ""
        }

        // If skipped currently playing video
        else if (index === 0) {
          this.loadVideo(this.stream.queue[0])
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
            [this.stream.type]: { volume: playerData.volume }
          })
        )
      }
      Object.keys(playerData).forEach(key => {
        this.playerData[key] = playerData[key]
      })
    },

    addVideo(videoId, video) {
      this.addVideoToYouTubeQueue({ stream: this.stream, videoId, video })
      // If the queue was empty before this, play this video
      if (this.stream.queue.length === 1) {
        this.playerData.isPaused = false
      }
    },

    playVideo() {
      this.$socket.SFU.emit(`room-stream-youtube-play`, {
        id: this.stream.id,
        time: this.playerData.time || 0
      })
      this.setYouTubeVideoState({ state: 1, stream: this.stream })
      this.playerData.isPaused = false
    },

    pauseVideo() {
      this.$socket.SFU.emit(`room-stream-youtube-pause`, {
        id: this.stream.id,
        time: this.playerData.time || 0
      })
      this.setYouTubeVideoState({ state: 2, stream: this.stream })
      this.playerData.isPaused = true
    },

    skipVideo(index) {
      this.playerData.duration = 0
      this.$socket.SFU.emit(`room-stream-youtube-skip-video`, {
        id: this.stream.id,
        index
      })
    },

    loadVideo(videoId) {
      this.playerData.isPaused = false
      this.setYouTubeVideoState({ state: 1, stream: this.stream })
      this.playerData.activeVideoId = ""
      this.playerData.activeVideoId = videoId
    },

    timeChange(event) {
      // TODO: throttle this function
      const time = Number(event.target.value)
      this.$socket.SFU.emit(`room-steam-youtube-player-time`, {
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

<style>
</style>