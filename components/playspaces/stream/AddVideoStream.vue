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
      "setLocalTrack": "stream/setLocalTrack"
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
        // TODO error alert
        return
      }

      this.setLocalTrack({ type: "video", track: res.stream.getVideoTracks()[0] })
      this.setLocalTrack({ type: "audio", track: res.stream.getAudioTracks()[0] })
    }
  }
}
</script>

<style>

</style>