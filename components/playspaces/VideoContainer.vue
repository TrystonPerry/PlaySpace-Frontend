<template>
  <div ref="videos" class="relative flex flex-wrap items-center justify-center">
    <video
      src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_20mb.mp4"
      class="video"
    ></video>
    <iframe
      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      class="video"
    ></iframe>
    <iframe
      src="https://player.twitch.tv/?channel=manvsgame&enableExtensions=true&muted=true&player=popout&volume=0.39"
      frameborder="0"
      allowfullscreen
      class="video"
    ></iframe>
    <video
      src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_20mb.mp4"
      class="video"
    ></video>
    <video
      src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_20mb.mp4"
      class="video"
    ></video>
    <video
      src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_20mb.mp4"
      class="video"
    ></video>
  </div>
</template>

<script>
import _ from "@/functions/_"

export default {
  mounted() {
    this.setProperSize()
    this.setProperSizeThrottled = _.throttle(this.setProperSize, 100)
    window.addEventListener("resize", this.setProperSizeThrottled)
    this.unsubscribeFromActions = this.$store.subscribeAction(async () => {
      await this.$nextTick()
      // TODO: check if event is of type scroll and throttle
      this.setProperSize()
    })
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.setProperSizeThrottled)
    this.unsubscribeFromActions()
  },

  methods: {
    setProperSize() {
      this.$refs.videos.style.height = "calc(100vh - 7rem)"

      const height = this.$refs.videos.offsetHeight
      const width = this.$refs.videos.offsetWidth

      const videos = this.$refs.videos.querySelectorAll(".video")
      const n = videos.length

      let bestHeight = 0
      let bestWidth = 0
      let rowsCount = 0

      for (let perRow = 1; perRow <= n; perRow++) {
        let numRows = Math.ceil(n / perRow)
        let maxWidth = Math.floor(width / perRow)
        let maxHeight = Math.floor(height / numRows)

        if ((maxWidth * 9) / 16 < maxHeight) {
          maxHeight = (maxWidth * 9) / 16
        } else {
          maxWidth = (maxHeight * 16) / 9
        }

        if (maxWidth > bestWidth) {
          bestWidth = maxWidth
          bestHeight = maxHeight
          rowsCount = numRows
        }
      }

      this.$refs.videos.style.height = `${rowsCount * bestHeight}px`

      videos.forEach(video => {
        video.style.height = `${Math.floor(bestHeight) - 4}px`
        video.style.width = `${Math.floor(bestWidth) - 4}px`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.video {
  background: black;
}
</style>
