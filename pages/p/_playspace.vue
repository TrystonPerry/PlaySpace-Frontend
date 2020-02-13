<template>
  <div
    :key="$route.params.playspace"
    class="relative playspace h-full"
    style="max-height:100%"
  >
    <div class="flex flex-col h-full relative">
      <div
        class="flex-shrink-0 text-center text-gray-300 overflow-y-auto"
        :class="{ 'flex-shrink-0': $store.state.nav.isMobile && totalStreams }"
        :style="
          $store.state.nav.isMobile && !totalStreams ? 'max-height:40vh' : ''
        "
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
          class="channel__header relative px-5 py-5 sm:py-20"
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
            style="z-index:-1; filter: blur(4px)"
          />
        </div>

        <client-only>
          <div
            v-if="!totalStreams && canStream && !$store.state.nav.isMobile"
            class="py-4 mt-6"
          >
            <h2 class="text-lg font-bold">
              Click below to share your desktop, a YouTube video, or Twitch
              Stream
            </h2>
            <AddStream class="max-w-48 w-full mx-auto mt-5" />
          </div>
        </client-only>
      </div>

      <PlaySpaceMobileSidebar
        v-if="$store.state.nav.isMobile"
        :key="$route.params.playspace"
        class="flex-grow"
      />

      <div class="channel__actions flex flex-shrink-0 bg-dark-5 w-full">
        <AddStream
          class="flex-grow flex-shrink-0 flex items-center"
          btn-classes="flex-grow"
        >
          <p-icon icon="fas fa-plus" />
          <div class="text-xs">Add Stream</div>
        </AddStream>
        <p-btn variant="none" size="sm" class="flex-grow flex-shrink-0">
          <p-icon icon="fas fa-share-alt" />
          <div class="text-xs">Share</div>
        </p-btn>
        <p-btn variant="none" size="sm" class="flex-grow flex-shrink-0">
          <p-icon icon="fas fa-user-plus" />
          <div class="text-xs">Users</div>
        </p-btn>
        <p-btn variant="none" size="sm" class="flex-grow flex-shrink-0">
          <p-icon icon="fas fa-cog" />
          <div class="text-xs">Settings</div>
        </p-btn>
      </div>
    </div>
    <AddStream
      v-if="totalStreams && canStream && !$store.state.nav.isMobile"
      class="absolute bottom-0 left-0 m-2"
    />
    <client-only>
      <portal to="modal-container">
        <div
          v-if="$store.state.stream.isSoundBlocked"
          class="absolute w-full p-2 max-w-96 w-full"
          style="bottom: 4rem;left:50%;transform:translateX(-50%);z-index:100"
        >
          <div
            class="bg-black-600 text-black-800 shadow-reg py-3 px-5 rounded-lg border-4 border-black-800"
          >
            <h1 class="text-xl font-bold text-center">
              Sound Muted by Default
            </h1>
            <p>
              Your browser has blocked sound from autoplaying, click to hear
              everyone.
            </p>
            <div class="text-center">
              <p-btn
                @click="$store.dispatch('stream/setIsSoundBlocked', false)"
                variant="none"
                class="bg-black-800 mt-4"
              >
                <p-icon icon="fas fa-volume-mute" />
                Click to Unmute
              </p-btn>
            </div>
          </div>
        </div>
      </portal>
    </client-only>
  </div>
</template>

<script>
import { Device } from "mediasoup-client"
import { mapGetters, mapActions } from "vuex"

import Vue from "vue"
import API from "@/api/api"

import VideoContainer from "@/components/playspaces/VideoContainer"
import PlaySpaceMobileSidebar from "@/components/navigation/PlaySpaceMobileSidebar"
import AddStream from "@/components/playspaces/stream/AddStream"

export default {
  layout: "app",

  components: {
    VideoContainer,
    PlaySpaceMobileSidebar,
    AddStream
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
    // TODO move transports and device to store.
    // TODO only request a new transport once per session
    this.$socket.SFU.emit("room-join", { roomId: this.$route.params.playspace })
    this.$store.dispatch("playSpace/setCurrentPlaySpace", this.playSpace)
    // Subscribe to PlaySpace deleted event
    this.sockets.API.subscribe(`room-deleted-${this.playSpace.id}`, () => {
      this.$router.push({ path: "/live" })
    })
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
      onerror({ type, text }) {
        console.error(`${type} error: ${text}`)
        this.$notify({
          type: "error",
          title: `${type} error`,
          text
        })
      },

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

        this.$socket.SFU.emit("room-transport-create", "recv")
        // TODO only call this directly before a produce request
        this.$socket.SFU.emit("room-transport-create", "send")

        this.addStreams(roomData.streams)
      },

      "room-sendtransport-created": async function(transportOptions) {
        this.sendTransport = await this.device.createSendTransport(
          transportOptions
        )
        this.connectTransport(this.sendTransport)

        this.sendTransport.on("produce", (params, callback, errback) => {
          const requestId = Math.random()
            .toString(36)
            .substr(2, 9)

          this.$socket.SFU.emit("room-transport-produce", {
            producerOptions: {
              transportId: this.sendTransport.id,
              kind: params.kind,
              rtpParameters: params.rtpParameters
            },
            requestId
          })

          this.sockets.SFU.subscribe(
            `room-transport-produced-${requestId}`,
            callback
          )
        })

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

  watch: {
    "$store.state.playSpace.current"(playSpace) {
      this.playSpace = playSpace
    },

    "$store.state.stream.isSoundBlocked"(value) {
      if (value === true) {
        this.onClick = () => {
          this.$store.dispatch("stream/setIsSoundBlocked", false)
        }
        document.body.addEventListener("click", this.onClick)
      } else if (this.onClick) {
        document.body.removeEventListener("click", this.onClick)
        delete this.onClick
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

  &__actions > .p-btn {
    @apply mr-1;
    @apply flex-shrink-0;
  }
}
</style>
