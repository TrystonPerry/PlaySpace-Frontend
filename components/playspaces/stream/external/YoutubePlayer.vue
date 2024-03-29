<template>
  <div class="h-full w-full">
    <div
      :id="stream.id"
      frameborder="0"
      class="w-full h-full"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    ></div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

export default {
  props: {
    stream: {
      type: Object,
      required: true
    },

    playerData: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    player: null,
    interval: null
  }),

  mounted() {
    this.startedAt = Date.now()
    this.player = new YT.Player(this.stream.id, {
      videoId: this.playerData.activeVideoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablenewui: 1,
        modestbranding: 1,
        playsinline: 1
      },
      events: {
        onReady: this.onReady,
        onStateChange: this.onPlayerStateChange
      }
    })
  },

  beforeDestroy() {
    clearInterval(this.interval)
  },

  // Hook into player data events
  watch: {
    "playerData.time"(time) {
      this.player.seekTo(time)
    },
    "playerData.volume"(volume) {
      this.player.setVolume(volume)
      if (volume > 0) this.playerData.isMuted = false
      else this.playerData.isMuted = true
    },
    "playerData.isMuted"(isMuted) {
      if (isMuted) this.player.mute()
      else this.player.unMute()
    },
    "stream.state"(state) {
      if (state === 2) this.player.pauseVideo()
      else this.player.playVideo()
    },
    "playerData.activeVideoId"(videoId) {
      console.log(videoId)
      if (!videoId) return
      this.player.loadVideoById(videoId)
    }
  },

  methods: {
    ...mapActions({
      setYouTubeVideoState: "stream/setYouTubeVideoState",
      setYouTubeVideoTime: "stream/setYouTubeVideoTime"
    }),

    onReady() {
      // Mute video due to autoplaying with sound block
      this.player.setVolume(0)
      this.player.isMuted = true

      this.player.playVideo()

      // If brand new player
      if (this.stream.state === -1) {
        this.setYouTubeVideoState({
          stream: this.stream,
          state: 1
        })
      }

      // If video is playing, update time
      else if (this.stream.state === 1) {
        this.setYouTubeVideoTime({
          stream: this.stream,
          time: this.stream.time + (Date.now() - this.startedAt) / 1000
        })
      }

      // If player is paused, pause it
      else if (this.stream.state === 2) {
        this.player.pauseVideo()
      }

      this.player.seekTo(this.stream.time)

      // Unmute player
      this.player.isMuted = false
      this.player.setVolume(this.playerData.volume)

      // Add interval to update video / player data
      this.interval = setInterval(() => {
        const time = this.player.getCurrentTime()
        const duration = this.player.getDuration()

        // Update player time
        this.setYouTubeVideoTime({
          stream: this.stream,
          time
        })

        // If video has just ended
        if (duration !== 0 && time >= duration) {
          this.$emit("skipVideo", 0)
        }

        this.$emit("updatePlayerData", { duration })
      }, 1000)
    },

    onPlayerStateChange(event) {
      if (event.data === 1 && this.stream.state === 2) {
        this.player.pauseVideo()
      } else if (event.data === 2 && this.stream.state === 1) {
        this.player.playVideo()
      }
    }
  }
}
</script>