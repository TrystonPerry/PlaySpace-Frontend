<template>
  <div
    :id="stream.id"
    frameborder="0"
    class="w-full h-full"
    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
  ></div>
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
    this.player = new YT.Player(this.stream.id, {
      videoId: this.stream.queue[0],
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablenewui: 1,
        modestbranding: 1,
        playsinline: 1
      },
      events: {
        onStateChange: this.onPlayerStateChange
      }
    })

    setTimeout(() => {
      // If brand new player
      if (this.stream.state === -1) {
        this.setYouTubeVideoState({
          stream: this.stream,
          state: 1
        })
        // Load video
        this.$emit("updatePlayerData", {
          isPaused: false,
          duration: this.player.getDuration()
        })
      }

      // If video is playing, update time
      else if (this.stream.state === 1) {
        this.setYouTubeVideoTime({
          stream: this.stream,
          time: this.stream.time + 2
        })
        // Play video
        this.$emit("updatePlayerData", {
          isPaused: false,
          duration: this.player.getDuration()
        })
      }

      // If player is paused, pause it
      else if (this.stream.state === 2) {
        // Pause video
        this.$emit("updatePlayerData", {
          isPaused: true,
          duration: this.player.getDuration()
        })
      }

      this.player.seekTo(this.stream.time)

      // Add interval to update video / player data
      this.interval = setInterval(() => {
        const time = this.player.getCurrentTime()
        const duration = this.player.getDuration()
        const state = this.player.getPlayerState()

        // Update player time
        this.setYouTubeVideoTime({
          stream: this.stream,
          time
        })

        // If time is off by 0.5 seconds
        if (time - 0.5 < this.stream.time || this.stream.time > time + 0.5) {
          this.player.seekTo(this.stream.time)
        }

        // If state is out of sync
        else if (state === 1 && this.stream.state === 2) {
          this.player.pauseVideo()
        } else if (state === 2 && this.stream.state === 2) {
          this.player.playVideo()
        }

        // If video has just ended
        if (duration !== 0 && time >= duration) {
          this.$emit("skipVideo", 0)
        }

        this.$emit("updatePlayerData", { duration })
      }, 1000)
    }, 2000)
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
    "playerData.isPaused"(isPaused) {
      if (isPaused) this.player.pauseVideo()
      else this.player.playVideo()
    },
    "playerData.activeVideoId"(videoId) {
      if (!videoId) return
      this.player.loadVideoById(videoId)
    }
  },

  methods: {
    ...mapActions({
      setYouTubeVideoState: "stream/setYouTubeVideoState",
      setYouTubeVideoTime: "stream/setYouTubeVideoTime"
    }),

    onPlayerStateChange(event) {
      return
      if (event.data === 1 && this.playerData.isPaused) {
        this.player.pauseVideo()
      } else if (event.data === 2 && !this.playerData.isPaused) {
        this.player.playVideo()
      }
    }
  }
}
</script>