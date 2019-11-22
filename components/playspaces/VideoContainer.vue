<template>
  <div ref="videos" class="relative flex flex-wrap items-center justify-center">
    <iframe
      src="https://www.youtube.com/embed/5he75Jftp1Y"
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      class="video"
    ></iframe>
  </div>
</template>

<script>
import _ from "@/functions/_"

export default {
  mounted() {
    this.setProperSize()
    window.addEventListener("resize", this.setProperSize)

    this.unsubscribeFromActions = this.$store.subscribeAction(async () => {
      await this.$nextTick()
      // TODO: check if event is of type scroll and throttle
      this.setProperSize()
    })
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.setProperSize)
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
