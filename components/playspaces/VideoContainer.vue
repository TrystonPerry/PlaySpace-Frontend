<template>
  <div>
    <div ref="videos" class="relative flex flex-wrap items-center justify-center">
      <Producer v-if="$store.state.stream.video.producer" class="video" />
    </div>
    <!-- <div v-if="showControls && !$store.state.nav.isMobile"> -->
      <AddVideoStream />
    <!-- </div> -->
  </div>
</template>

<script>
import _ from "@/functions/_"

import Producer from "./stream/Producer"
import AddVideoStream from "./stream/AddVideoStream"

export default {
  components: {
    Producer,
    AddVideoStream
  },

  data: () => ({
    showControls: true
  }),

  mounted() {
    this.setProperSize()
    window.addEventListener("resize", this.setProperSize)

    this.unsubscribeFromActions = this.$store.subscribeAction(async () => {
      await this.$nextTick()
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
