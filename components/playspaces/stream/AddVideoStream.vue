<template>
  <p-dropdown btn-classes="p-btn btn-primary-dashed w-48">
    <p-icon icon="fas fa-plus" />
    Add Video
    <ul
      slot="content"
      class="absolute list-style-none bg-dark-5 shadow-reg w-48"
      :style="dropUp ? 'bottom:44px' : ''"
    >
      <li>
        <button @click="getDesktopStream" class="bg-primary font-bold text-gray-300 py-2 w-full">
          <p-icon icon="fas fa-desktop" />
          Desktop
        </button>
      </li>
      <li>
        <button class="text-gray-300 py-2 w-full" style="background:#FE0200;">
          <p-icon icon="fab fa-youtube"  />
          YouTube
        </button>
      </li>
      <li>
        <button class="text-gray-300 py-2 w-full" style="background:#9047FF">
          <p-icon icon="fab fa-twitch"  />
          Twitch
        </button>
      </li>
    </ul>
  </p-dropdown>
</template>

<script>
import WebRTC from "@/functions/webrtc"

import { mapActions } from "vuex"

export default {
  props: {
    dropUp: {
      type: Boolean,
      default: false
    }
  },

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
  }
}
</script>

<style>

</style>