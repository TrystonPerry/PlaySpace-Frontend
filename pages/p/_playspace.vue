<template>
  <div
    :key="$route.params.playspace"
    class="relative playspace h-full"
    style="max-height:100%"
  >
    <div class="flex flex-col h-full">
      <div
        class="text-center text-gray-300 overflow-y-auto"
        :style="$store.state.nav.isMobile ? 'max-height:40vh' : ''"
      >
        <VideoContainer
          v-if="device"
          :device="device"
          :sendTransport="sendTransport"
          :recvTransport="recvTransport"
          class="video-container"
        />

        <div
          v-if="!totalStreams"
          class="channel__header relative px-5 py-5 sm:py-20 border-b-2 mb-6 border-gray-300"
          style="z-index:2"
        >
          <div class="md:flex items-center container mx-auto">
            <div class="md:w-6/12 md:text-left">
              <p-avatar
                :avatar="playSpace.avatar"
                size="lg"
                img-classes="shadow-reg"
                class="mb-2"
              />
              <h1 class="text-2xl font-bold">{{ playSpace.channelName }}</h1>
              <h2 class="text-lg">{{ playSpace.title }}</h2>
              <p-copy :text="`https://playspace.tv/p/${playSpace.id}`" variant="primary" class="mt-3">
                <p-icon icon="fas fa-link" />
                Copy Link
              </p-copy>
            </div>
            <div class="md:w-6/12 md:text-right">
              <h2
                class="text-xl mt-4 font-bold inline-block border-b border-gray-300 px-6 md:pr-0 mb-2"
              >
                Users
              </h2>
              <ul class="list-style-none">
                <li v-for="user in users" :key="user.username">
                  <span>{{ user.rank }} - </span>
                  <h3 class="font-bold inline-block">
                    {{ user.username }}
                  </h3>
                </li>
              </ul>
            </div>
          </div>
          <!-- <div
            class="absolute flex"
            style="left:50%;bottom:-1.5rem;transform:translateX(-50%);"
          >
            <p-btn variant="primary" size="lg" class="mr-1">
              <p-icon icon="fas fa-plus" />
              Start a Stream
            </p-btn>
            <p-btn variant="none" size="lg" class="bg-dark-2">
              <p-icon icon="fas fa-cog" />
              Settings
            </p-btn>
          </div> -->
          <p-avatar 
            :avatar="playSpace.avatar" 
            class="w-full h-full absolute top-0 left-0 object-cover bg-gray-100 opacity-25"
            img-classes="w-full h-full"
            no-rounded
            style="z-index:-1; filter: blur(4px)" />
        </div>

        <client-only>
          <div
            v-if="!totalStreams && canStream && !$store.state.nav.isMobile"
            class="pt-4"
          >
            <h2 class="text-lg font-bold">
              Click below to share your desktop, a YouTube video, or Twitch
              Stream
            </h2>
            <AddVideoStream class="max-w-48 w-full mx-auto mt-5" />
          </div>
        </client-only>
      </div>

      <PlaySpaceMobileSidebar
        v-if="$store.state.nav.isMobile"
        :key="$route.params.playspace"
        class="flex-grow"
      />
    </div>
    <AddVideoStream
      v-if="totalStreams && canStream"
      drop-up
      class="absolute bottom-0 left-0 m-2"
    />
  </div>
</template>

<script>
import { Device } from "mediasoup-client"
import { mapGetters, mapActions } from "vuex"

import Vue from "vue"
import API from "@/api/api"

import VideoContainer from "@/components/playspaces/VideoContainer"
import PlaySpaceMobileSidebar from "@/components/navigation/PlaySpaceMobileSidebar"
import AddVideoStream from "@/components/playspaces/stream/AddVideoStream"

export default {
  layout: "app",

  components: {
    VideoContainer,
    PlaySpaceMobileSidebar,
    AddVideoStream
  },

  head() {
    return require("@/meta/p/_playspace")({
      title: `${this.playSpace.channelName} - PlaySpace`,
      desc: this.playSpace.title,
      img: this.playSpace.avatar,
      url: this.$route.path
    })
  },

  data: () => ({
    device: null,
    sendTransport: null,
    recvTransport: null
  }),

  async asyncData({ params, error }) {
    const { data, success } = await API.getPlaySpace(params.playspace)

    if (!success) {
      return error({
        statusCode: 404,
        message: "No channel with that username exists"
      })
    }

    return { playSpace: data }
  },

  mounted() {
    this.$socket.SFU.emit("room-join", { roomId: this.$route.params.playspace })
    this.$store.dispatch("playSpace/setCurrentPlaySpace", this.playSpace)
  },

  beforeDestroy() {
    this.$socket.SFU.emit("room-leave")
    this.$store.dispatch("playSpace/removeCurrentPlaySpace")
    this.reset()
    window.device = null
    window.sendTransport = null
    window.recvTransport = null
  },

  computed: {
    ...mapGetters({
      totalStreams: "stream/totalStreams",
      users: "playSpace/users"
    }),

    canStream() {
      if (!this.playSpace.users) return false
      const { username } = this.$store.state.user
      return username && !!this.playSpace.users[username]
    }
  },

  sockets: {
    API: {
      "room-users-update"(user) {
        if (
          user.username === this.$store.state.user.username &&
          user.rank !== "none"
        ) {
          this.$notify({
            type: "success",
            title: "You have been granted access to this PlaySpace",
            text: `You can now stream on ${this.playSpace.channelName}`
          })
        } else if (
          user.username === this.$store.state.user.username &&
          user.rank === "none"
        ) {
          // TODO handle better
          location.reload()
          this.$notify({
            type: "error",
            title: "You have been revoked access to this PlaySpace",
            text: `You can no longer stream on ${this.playSpace.channelName}`
          })
        }
        this.$store.dispatch("playSpace/updateUserRankInCurrentPlaySpace", user)
      }
    },
    SFU: {
      "room-joined": async function(roomData) {
        const { routerRtpCapabilities } = roomData

        this.device = new Device()
        await this.device.load({ routerRtpCapabilities })
        window.device = this.device

        if (!this.device.canProduce("video")) {
          return alert("You cant produce video")
        }
        if (!this.device.canProduce("audio")) {
          return alert("You cant produce audio")
        }

        this.$socket.SFU.emit("room-transport-create", "send")
        this.$socket.SFU.emit("room-transport-create", "recv")

        this.addStreams(roomData.streams)
      },

      "room-sendtransport-created": async function(transportOptions) {
        this.sendTransport = await this.device.createSendTransport(
          transportOptions
        )
        this.connectTransport(this.sendTransport)
        window.sendTransport = this.sendTransport
      },

      "room-recvtransport-created": async function(transportOptions) {
        this.recvTransport = await this.device.createRecvTransport(
          transportOptions
        )
        this.connectTransport(this.recvTransport)
        window.recvTransport = this.recvTransport
      },

      "room-stream-video": async function(stream) {
        this.addStream({ type: "video", stream })
      },

      "room-stream-mic": async function(stream) {
        this.addStream({ type: "mic", stream })
      },

      "room-stream-external"(stream) {
        this.addStream({ type: "external", stream })
      },

      disconnect() {
        this.reset()
      },

      reconnect() {
        this.$socket.SFU.emit("room-join", {
          roomId: this.$route.params.playspace
        })
      }
    }
  },

  methods: {
    ...mapActions({
      addStream: "stream/addStream",
      reset: "stream/reset",
      setCurrentPlaySpace: "playSpace/setCurrentPlaySpace"
    }),

    async connectTransport(transport) {
      transport.on("connect", ({ dtlsParameters }, callback, errback) => {
        this.$socket.SFU.emit("room-transport-connect", {
          type: transport.direction,
          transportOptions: {
            transportId: transport.id,
            dtlsParameters
          }
        })

        this.sockets.SFU.subscribe("room-transport-connected", callback)
      })
    },

    // Add streams recieved from server to vue store
    addStreams(streams) {
      const keys = Object.keys(streams)
      keys.forEach(key => {
        streams[key].forEach(stream => {
          this.addStream({ type: key, stream })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.channel {
  &__header {
    h1,
    h2,
    li {
      text-shadow: 0 0 10px black;
    }
  }
}
</style>
