<template>
  <div>
    <p-btn @click="getDesktopStream" variant="primary">
      Add Desktop Stream
    </p-btn>
    {{ $store.state.stream.video.producer }}
  </div>
</template>

<script>
import WebRTC from "@/functions/webrtc"

import { mapActions } from "vuex"

export default {
  methods: {
    ...mapActions({
      "setLocalStream": "stream/setLocalStream",
      "setProducer": "stream/setProducer"
    }),

    async getDesktopStream() {
      const constraints = {
        video: {
          "width": "1280",
          "height": "720"
        },
        audio: true
      }

      const res = await WebRTC.getDisplayMedia(constraints)

      if (!res.success) {
        return
      }
      
      this.setLocalStream(res.stream)

      const track = this.$store.state.stream.localStream.getVideoTracks()[0]

      this.setProducer({ type: "video", track })
    }
  },

  startStream() {

  }
}
</script>

<style>

</style>