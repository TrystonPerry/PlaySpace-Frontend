<template>
  <div class="h-full w-full">
    <div :id="stream.id" frameborder="0" class="w-full h-full"></div>
  </div>
</template>

<script>
import { mapActions } from "vuex"

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
    this.player = DM.player(document.getElementById(this.stream.id), {
      video: this.playerData.activeVideoId,
      width: "100%",
      height: "100%",
      params: {
        api: 1,
        autoplay: true,
        "autoplay-mute": true,
        controls: false,
        "queue-autoplay-next": false,
        "queue-enable": false,
        "sharing-enable": false,
        start: this.stream.time,
        "ui-start-screen-info": false
      }
    })

    this.player.addEventListener("apiready", this.onReady)
  },

  beforeDestroy() {
    clearInterval(this.interval)
  },

  watch: {
    "playerData.time"(time) {
      this.player.seek(time)
    },
    "playerData.volume"(volume) {
      this.player.setVolume((volume / 100).toFixed(2))
    },
    "playerData.isMuted"(isMuted) {
      this.player.setMuted(isMuted)
    },
    "stream.state"(state) {
      if (state === 2) this.player.pause()
      else this.player.play()
    },
    "playerData.activeVideoId"(videoId) {
      if (!videoId) return
      console.log(videoId)
      this.player.load({
        video: videoId,
        autoplay: true,
        start: 0
      })
    }
  },

  methods: {
    ...mapActions({
      setYouTubeVideoState: "stream/setYouTubeVideoState",
      setYouTubeVideoTime: "stream/setYouTubeVideoTime"
    }),

    onReady() {
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
        this.player.pause()
      }

      // Unmute player
      this.player.setMuted(false)
      this.player.setVolume(0.5)

      // console.log(this.player.volume)
      // console.log(this.player.muted)

      // Add interval to update video / player data
      this.interval = setInterval(() => {
        const time = this.player.currentTime
        const duration = this.player.duration

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
    }
  }
}
</script>

<style>
</style>