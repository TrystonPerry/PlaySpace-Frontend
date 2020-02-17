<template>
  <div v-if="isAddStreamBtnVisible" class="add-video-stream">
    <p-btn @click="isModal = true" variant="none" size="sm" :class="btnClasses">
      <slot></slot>
    </p-btn>

    <p-modal v-model="isModal" @input="reset">
      <h1 class="text-2xl font-bold mb-2">
        Add a Stream
      </h1>
      <ul class="flex flex-wrap justify-center mb-4">
        <!-- Streamable on Desktop -->
        <li
          v-if="canProduceOnDesktop"
          class="flex-shrink-0 w-full m-1 max-w-48"
        >
          <button
            @click="getDesktopStream"
            class="bg-primary font-bold text-gray-300 py-2 w-full"
          >
            <p-icon icon="fas fa-desktop" />Desktop
          </button>
        </li>
        <li
          v-if="canProduceOnDesktop"
          class="flex-shrink-0 w-full m-1 max-w-48"
        >
          <button
            @click="getWebcamStream"
            class="bg-primary font-bold text-gray-300 py-2 w-full"
          >
            <p-icon icon="fas fa-camera" />Webcam
          </button>
        </li>

        <!-- Streamable on Desktop only if Room -->
        <li
          v-if="canAddStreamOnDesktop"
          class="flex-shrink-0 w-full m-1 max-w-48"
        >
          <button
            @click="mode = 'youtube'"
            class="text-gray-300 py-2 w-full font-bold"
            style="background:#FE0200;"
          >
            <p-icon icon="fab fa-youtube" />YouTube
          </button>
        </li>
        <li
          v-if="canAddStreamOnDesktop"
          class="flex-shrink-0 w-full m-1 max-w-48"
        >
          <button
            @click="mode = 'twitch'"
            class="text-gray-300 py-2 w-full font-bold"
            style="background:#9047FF"
          >
            <p-icon icon="fab fa-twitch" />Twitch
          </button>
        </li>

        <!-- Streamable on Mobile -->
        <li v-if="canProduceOnMobile" class="flex-shrink-0 w-full m-1 max-w-48">
          <button
            @click="getWebcamStream({ facingMode: 'user' })"
            class="bg-primary font-bold text-gray-300 py-2 w-full"
          >
            <p-icon icon="fas fa-camera" />Front Camera
          </button>
        </li>
        <li v-if="canProduceOnMobile" class="flex-shrink-0 w-full m-1 max-w-48">
          <button
            @click="getWebcamStream({ facingMode: { exact: 'environment' } })"
            class="bg-primary font-bold text-gray-300 py-2 w-full"
          >
            <p-icon icon="fas fa-camera" />Back Camera
          </button>
        </li>
      </ul>

      <div v-if="mode === 'youtube'">
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
      </div>
      <div v-if="mode === 'twitch'">
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
      </div>
    </p-modal>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex"

import WebRTC from "@/functions/webrtc"

import { mapActions } from "vuex"

const regex = {
  youtubeUrl: /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/,
  twitchUrl: /^(https?:\/\/twitch.tv\/)?(\w+)$/
}

export default {
  props: {
    btnClasses: {
      type: String,
      default: ""
    }
  },

  data: () => ({
    isModal: false,
    mode: "",
    youtubeUrl: "",
    twitchUsername: ""
  }),

  computed: {
    ...mapState({
      isMobile: state => state.nav.isMobile
    }),

    ...mapGetters({
      totalStreams: "stream/totalStreams",
      totalExternalStreams: "stream/totalExternalStreams",
      isStreamer: "playSpace/isStreamer",
      isStreaming: "stream/isStreaming"
    }),

    canProduce() {
      return this.totalStreams < 5 && !this.isStreaming
    },

    canProduceOnDesktop() {
      return !this.isMobile && this.canProduce
    },

    canAddStreamOnDesktop() {
      return !this.isMobile && this.totalExternalStreams < 5
    },

    canProduceOnMobile() {
      return this.isMobile && this.canProduce
    },

    isAddStreamBtnVisible() {
      if (this.isStreamer) {
        if (this.isMobile) {
          return !this.isStreaming
        } else {
          return this.totalStreams < 5
        }
      }
      return false
    }
  },

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

      this.reset()
    },

    async getWebcamStream(video, audio) {
      const constraints = {
        video: {
          width: {
            max: "1280"
          },
          height: {
            max: "720"
          },
          ...video
        },
        audio: audio ? audio : false
      }

      const res = await WebRTC.getUserMedia(constraints)

      if (!res.success) {
        if (res.error !== "Permission denied") {
          this.$notify({
            type: "error",
            title: "Error getting your camera",
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

      this.reset()
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

      this.reset()
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

      this.reset()
    },

    reset() {
      this.isModal = false
      this.mode = ""
      this.youtubeUrl = ""
      this.twitchUsername = ""
    }
  }
}
</script>

<style lang="scss" scoped></style>
