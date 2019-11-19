<template>
  <div ref="videos" class="flex flex-wrap items-center justify-center">
    <video
      src="https://trystonperry.com/public/videos/PlaySpace-Demo.mp4"
    ></video>
    <video
      src="https://trystonperry.com/public/videos/PlaySpace-Demo.mp4"
    ></video>
    <video
      src="https://trystonperry.com/public/videos/PlaySpace-Demo.mp4"
    ></video>
    <video
      src="https://trystonperry.com/public/videos/PlaySpace-Demo.mp4"
    ></video>
  </div>
</template>

<script>
export default {
  data: () => ({
    timeout: undefined
  }),

  mounted() {
    this.getProperSize()
    window.addEventListener("resize", this.getProperSize)
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.getProperSize)
  },

  methods: {
    getProperSize() {
      this.$refs.videos.style.height = "calc(100vh - 7rem)"

      const height = this.$refs.videos.offsetHeight
      const width = this.$refs.videos.offsetWidth

      const videos = this.$refs.videos.querySelectorAll("video")
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

<style>
</style>