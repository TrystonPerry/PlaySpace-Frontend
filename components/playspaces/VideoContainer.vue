<template>
  <div class="bg-black">
    <div
      ref="videos"
      class="relative flex flex-wrap items-center justify-center"
    >
      <MultiConsumer
        v-if="$store.state.stream.streams.video.length && recvTransport"
        @connect="setProperSize"
        :device="device"
        :recvTransport="recvTransport"
        class="video"
      />
      <Producer
        v-if="$store.state.stream.tracks.video && !isMobile"
        :sendTransport="sendTransport"
        class="video relative w-full h-full"
      />
      <ExternalStream
        v-for="stream in externalStreams"
        :key="stream.id"
        :stream="stream"
        class="video"
      />
    </div>
  </div>
</template>

<script>
import _ from "@/functions/_"

import MultiConsumer from "./stream/MultiConsumer"
import Producer from "./stream/Producer"
import AddVideoStream from "./stream/AddVideoStream"
import ExternalStream from "./stream/ExternalStream"

export default {
  components: {
    MultiConsumer,
    Producer,
    AddVideoStream,
    ExternalStream
  },

  props: {
    device: {
      required: true
    },
    recvTransport: {
      required: true
    },
    sendTransport: {
      required: true
    }
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

  computed: {
    externalStreams() {
      const external = this.$store.state.stream.streams.external
      if (!external.length) return
      if (this.$store.state.nav.isMobile) {
        if (this.$store.state.stream.streams.video.length > 0) {
          return []
        }
        return [external[0]]
      }
      return external
    }
  },

  methods: {
    setProperSize() {
      // TODO figure out why $refs are undefined in mounted
      if (!this.$refs.videos) return
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

      this.$refs.videos.style.height = `${Math.floor(rowsCount * bestHeight)}px`

      videos.forEach(video => {
        video.style.height = `${Math.floor(bestHeight)}px`
        video.style.width = `${Math.floor(bestWidth)}px`
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
