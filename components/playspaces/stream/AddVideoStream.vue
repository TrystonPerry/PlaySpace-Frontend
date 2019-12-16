<template>
  <div>
    <p-dropdown btn-classes="p-btn btn-primary-dashed w-48">
      <p-icon icon="fas fa-plus" />Add Video
      <ul
        slot="content"
        class="absolute list-style-none bg-dark-5 shadow-reg w-48"
        :style="dropUp ? 'bottom:44px' : ''"
      >
        <li>
          <button @click="getDesktopStream" class="bg-primary font-bold text-gray-300 py-2 w-full">
            <p-icon icon="fas fa-desktop" />Desktop
          </button>
        </li>
        <li>
          <button
            @click="isYoutube = true"
            class="text-gray-300 py-2 w-full"
            style="background:#FE0200;"
          >
            <p-icon icon="fab fa-youtube" />YouTube
          </button>
        </li>
        <li>
          <button
            @click="addTwitchStream"
            class="text-gray-300 py-2 w-full"
            style="background:#9047FF"
          >
            <p-icon icon="fab fa-twitch" />Twitch
          </button>
        </li>
      </ul>
    </p-dropdown>
    <p-modal v-model="isYoutube" class="text-left text-gray-200">
      <div class="flex items-center">
        <p-icon icon="fab fa-youtube text-4xl" style="color:#FE0200;" />
          <h2 class="text-2xl ml-2 font-medium">
          Add a YouTube Video
        </h2>
      </div>
      <h3 class="text-lg font-medium mb-2">
        Enter the video URL below
      </h3>
      <div class="flex">
        <p-input v-model="youtubeUrl" placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ" class="flex-grow" />
        <p-btn @click="addYouTubeStream" variant="primary" class="h-full">
          Add
        </p-btn>
      </div>
    </p-modal>
  </div>
</template>

<script>
import WebRTC from "@/functions/webrtc"

import { mapActions } from "vuex"

const regex = {
  youtubeUrl: /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/
}

export default {
  props: {
    dropUp: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    isYoutube: false,
    youtubeUrl: "",
    twitchUsername: ""
  }),

  methods: {
    ...mapActions({
      setLocalTrack: "stream/setLocalTrack"
    }),

    async getDesktopStream() {
      const constraints = {
        video: {
          width: "1280",
          height: "720"
        },
        audio: true
      }

      const res = await WebRTC.getDisplayMedia(constraints)

      if (!res.success) {
        // TODO error alert
        return
      }

      this.setLocalTrack({
        type: "video",
        track: res.stream.getVideoTracks()[0]
      })
      this.setLocalTrack({
        type: "audio",
        track: res.stream.getAudioTracks()[0]
      })
    },

    addTwitchStream() {
      const answer = prompt("Enter a twitch username")

      this.$socket.SFU.emit("room-stream-external", {
        type: "twitch",
        username: answer
      })
    },

    addYouTubeStream() {
      const match = this.youtubeUrl.match(regex.youtubeUrl)

      const url = match && match[7].length === 11 ? match[7] : false

      // TODO notify that it's an invalid URL
      if (!url) return

      this.$socket.SFU.emit("room-stream-external", {
        type: "youtube",
        videoId: url
      })
      this.isYoutube = false
    }
  }
}
</script>

<style>
</style>