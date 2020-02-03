<template>
  <div class="add-video-stream">
    <p-dropdown btn-classes="p-btn btn-primary-dashed w-48">
      <p-icon icon="fas fa-plus" />Add a Stream
      <ul
        slot="content"
        class="list-style-none bg-dark-5 shadow-reg w-48"
        :style="dropUp ? 'bottom:44px' : ''"
      >
        <li
          v-if="
            !$store.state.nav.isMobile &&
              $store.state.stream.streams.video.length < 5 &&
              !$store.state.stream.tracks.video
          "
        >
          <button
            @click="getDesktopStream"
            class="bg-primary font-bold text-gray-300 py-2 w-full"
          >
            <p-icon icon="fas fa-desktop" />Desktop
          </button>
        </li>
        <li
          v-if="
            $store.state.stream.streams.video.length < 5 &&
              !$store.state.stream.tracks.video
          "
        >
          <button
            @click="getWebcamStream"
            class="bg-primary font-bold text-gray-300 py-2 w-full"
          >
            <p-icon icon="fas fa-camera" />Webcam
          </button>
        </li>
        <li
          v-if="
            !$store.state.nav.isMobile &&
              $store.state.stream.streams.external.length < 5
          "
        >
          <button
            @click="isYoutube = true"
            class="text-gray-300 py-2 w-full font-bold"
            style="background:#FE0200;"
          >
            <p-icon icon="fab fa-youtube" />YouTube
          </button>
        </li>
        <li
          v-if="
            !$store.state.nav.isMobile &&
              $store.state.stream.streams.external.length < 5
          "
        >
          <button
            @click="isTwitch = true"
            class="text-gray-300 py-2 w-full font-bold"
            style="background:#9047FF"
          >
            <p-icon icon="fab fa-twitch" />Twitch
          </button>
        </li>
      </ul>
    </p-dropdown>
    <p-modal v-model="isYoutube" @close="youtubeUrl = ''" class="text-left">
      <div class="flex items-center">
        <p-icon icon="fab fa-youtube text-4xl" style="color:#FE0200;" />
        <h2 class="text-2xl ml-2 font-bold">
          Add a YouTube Video
        </h2>
      </div>
      <a
        href="https://youtube.com"
        target="_blank"
        class="text-primary hover:underline my-2 block"
      >
        Browse YouTube in new Tab
      </a>
      <h3 class="text-lg font-bold mb-2">
        Enter the video URL below
      </h3>
      <form @submit.prevent="addYouTubeStream" class="flex">
        <p-input
          v-model="youtubeUrl"
          placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          class="flex-grow"
        />
        <p-btn variant="primary" type="submit" class="h-full">
          Add
        </p-btn>
      </form>
    </p-modal>
    <p-modal v-model="isTwitch" @close="twitchUsername = ''">
      <div class="flex items-center">
        <p-icon icon="fab fa-twitch text-4xl" style="color:#9047FF" />
        <h2 class="text-2xl ml-2 font-bold">
          Add a Twitch Stream
        </h2>
      </div>
      <a
        href="https://twitch.tv"
        target="_blank"
        class="text-primary hover:underline my-2 block"
      >
        Browse Twitch in new Tab
      </a>
      <h3 class="text-lg font-bold mb-2">
        Enter the Twitch URL or username below
      </h3>
      <form @submit.prevent="addTwitchStream" class="flex">
        <p-input
          v-model="twitchUsername"
          placeholder="https://www.twitch.tv/drdisrespect or drdisrespect"
          class="flex-grow"
        />
        <p-btn variant="primary" type="submit" class="h-full">
          Add
        </p-btn>
      </form>
    </p-modal>
  </div>
</template>

<script>
import WebRTC from "@/functions/webrtc"

import { mapActions } from "vuex"

const regex = {
  youtubeUrl: /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/,
  twitchUrl: /^(https?:\/\/twitch.tv\/)?(\w+)$/
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
    isTwitch: false,
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
        if (res.error !== "Permission denied") {
          this.$notify({
            type: "error",
            title: "Error getting your desktop",
            text: res.error
          })
        }
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

    async getWebcamStream() {
      const constraints = {
        video: {
          width: {
            max: "1280"
          },
          height: {
            max: "720"
          }
        },
        audio: false
      }

      const res = await WebRTC.getUserMedia(constraints)

      if (!res.success) {
        if (res.error !== "Permission denied") {
          this.$notify({
            type: "error",
            title: "Error getting your desktop",
            text: res.error
          })
        }
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
      const match = this.twitchUsername.match(regex.twitchUrl)

      const username = match && match[2]

      // TODO notif
      if (!username) return

      this.$socket.SFU.emit("room-stream-external", {
        type: "twitch",
        username
      })

      this.isTwitch = false
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

<style lang="scss" scoped></style>
