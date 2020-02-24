<template>
  <div
    :key="$route.params.playspace"
    class="relative playspace h-full"
    style="max-height:100%"
  >
    <div class="flex flex-col h-full relative">
      <div
        class="flex-shrink-0 text-center text-gray-300 bg-dark-2 overflow-y-auto"
        :class="{ 'flex-shrink-0': $store.state.nav.isMobile && totalStreams }"
        :style="
          $store.state.nav.isMobile && !totalStreams ? 'max-height:40vh' : ''
        "
      >
        <VideoContainer
          v-if="device && sendTransport && recvTransport"
          class="video-container"
        />

        <div
          v-if="!totalStreams"
          class="channel__header relative px-5 py-5 sm:py-20"
          style="z-index:2"
        >
          <div class="container mx-auto">
            <div class="flex md:block items-center text-left">
              <p-avatar
                :avatar="playSpace.avatar"
                img-classes="shadow-reg w-12 h-12 md:w-24 md:h-24"
                class="flex-shrink-0 md:mb-2"
              />
              <div class="ml-2 md:ml-0">
                <h1 class="text-lg md:text-2xl font-bold">
                  {{ playSpace.channelName }}
                </h1>
                <h2 class="md:text-lg">{{ playSpace.title }}</h2>
              </div>
            </div>
          </div>
          <p-avatar
            :avatar="playSpace.avatar"
            class="hidden sm:block w-full h-full absolute top-0 left-0 object-cover bg-gray-100 opacity-25"
            img-classes="w-full h-full"
            no-rounded
            style="z-index:-1; filter: blur(4px)"
          />
        </div>
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
          <div class="text-xs">
            {{ totalStreams ? "Add Stream" : "Start Stream" }}
          </div>
        </AddStream>
        <p-btn
          v-if="$store.state.stream.tracks.video"
          @click="endVideoStream"
          variant="none"
          size="sm"
          class="flex-grow flex-shrink-0 "
        >
          <span class="text-red-500">
            <p-icon icon="fas fa-minus" />
            <div class="text-xs">End Stream</div>
          </span>
        </p-btn>
        <p-btn
          @click="share"
          variant="none"
          size="sm"
          class="flex-grow flex-shrink-0"
        >
          <p-icon icon="fas fa-share-alt" />
          <div class="text-xs">Share</div>
        </p-btn>
        <p-btn
          v-if="isOwner"
          @click="setModal('users')"
          variant="none"
          size="sm"
          class="flex-grow flex-shrink-0"
        >
          <p-icon icon="fas fa-user-plus" />
          <div class="text-xs">Users</div>
        </p-btn>
        <p-btn
          v-if="isOwner"
          @click="setModal('settings')"
          variant="none"
          size="sm"
          class="flex-grow flex-shrink-0"
        >
          <p-icon icon="fas fa-cog" />
          <div class="text-xs">Settings</div>
        </p-btn>
      </div>
    </div>
    <client-only>
      <portal to="modal-container">
        <div
          v-if="$store.state.stream.isSoundBlocked"
          class="absolute w-full max-w-96 w-full"
          style="bottom: 4rem;left:50%;transform:translateX(-50%);z-index:100"
        >
          <div
            class="bg-dark-5 text-gray-300 text-center shadow-reg py-3 px-5 rounded-lg shadow-xl"
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
                <p-icon icon="fas fa-volume-mute" />Click to Unmute
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
import { mapState, mapGetters, mapActions } from "vuex"

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

  data: () => ({
    device: null,
    sendTransport: null,
    recvTransport: null
  }),

  head() {
    return require("@/meta/p/_playspace")({
      title: `${this.playSpace.channelName} - PlaySpace`,
      desc: this.playSpace.title,
      img: this.playSpace.avatar,
      url: this.$route.path
    })
  },

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
    // TODO only request a new transport once per session
    this.$socket.SFU.emit("room-join", { roomId: this.$route.params.playspace })
    this.$socket.API.emit("chat-join", { id: this.$route.params.playspace })
    this.$store.dispatch("playSpace/setCurrentPlaySpace", this.playSpace)
    // Subscribe to PlaySpace deleted event
    this.sockets.API.subscribe(`room-deleted-${this.playSpace.id}`, () => {
      this.$router.push({ path: "/live" })
    })
  },

  beforeDestroy() {
    this.$socket.SFU.emit("room-leave")
    this.$socket.API.emit("chat-leave")
    this.$store.dispatch("playSpace/removeCurrentPlaySpace")
    this.$store.commit("chat/SET_MESSAGES", [])
    this.reset()
    this.$con.device = null
    this.$con.sendTransport = null
    this.$con.recvTransport = null
  },

  computed: {
    ...mapState({
      username: state => state.user.username,
      isMobile: state => state.nav.isMobile
    }),

    ...mapGetters({
      totalStreams: "stream/totalStreams",
      users: "playSpace/users",
      isStreamer: "playSpace/isStreamer",
      isOwner: "playSpace/isAuthorized"
    }),

    canStream() {
      if (!this.playSpace.users) return false
      const { username } = this.$store.state.user
      return username && !!this.playSpace.users[username]
    }
  },

  sockets: {
    API: {
      "chat-message"(messages) {
        this.$store.commit("chat/ADD_MESSAGES", messages)
      },

      "room-users-update"(user) {
        const { username, rank } = user

        // If you were granted access to playspace
        if (username === this.username && rank !== "none") {
          this.$notify({
            type: "success",
            title: "You have been granted access to this PlaySpace",
            text: `You can now stream on ${this.playSpace.channelName}`
          })
        }

        // If you were revoked access to this playspace
        else if (username === this.username && rank === "none") {
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

        this.$con.createDevice()

        this.$con.device = new Device()
        await this.$con.device.load({ routerRtpCapabilities })

        if (!this.$con.device.canProduce("video")) {
          return alert("You cant produce video")
        }
        if (!this.$con.device.canProduce("audio")) {
          return alert("You cant produce audio")
        }

        this.device = this.$con.device

        this.$socket.SFU.emit("room-transport-create", "recv")

        // TODO only call this directly before a produce request
        this.$socket.SFU.emit("room-transport-create", "send")

        this.addStreams(roomData.streams)
      },

      "room-sendtransport-created": async function(transportOptions) {
        this.$con.sendTransport = await this.$con.device.createSendTransport(
          transportOptions
        )
        this.connectTransport(this.$con.sendTransport)

        this.$con.sendTransport.on("produce", (params, callback, errback) => {
          const requestId = Math.random()
            .toString(36)
            .substr(2, 9)

          this.$socket.SFU.emit("room-transport-produce", {
            producerOptions: {
              transportId: this.$con.sendTransport.id,
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

        this.sendTransport = this.$con.sendTransport
      },

      "room-recvtransport-created": async function(transportOptions) {
        this.$con.recvTransport = await this.$con.device.createRecvTransport(
          transportOptions
        )
        this.connectTransport(this.$con.recvTransport)
        this.recvTransport = this.$con.recvTransport
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
      setCurrentPlaySpace: "playSpace/setCurrentPlaySpace",
      setModal: "nav/setModal"
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
    },

    endVideoStream() {
      this.$store.dispatch("stream/setLocalTrack", {
        type: "video",
        track: null
      })
    },

    // TODO move this share attempt code into p-share component
    // maybe store the url, text and title in the nav.js store?
    async share() {
      if (!navigator.share) {
        this.setModal("share")
        return
      }

      const { fullUsername } = this.$store.state.user
      let text = "Come watch our PlaySpace!"
      if (fullUsername) {
        text = `${fullUsername} has invited you to their PlaySpace!`
      }

      navigator.share({
        url: window.location.origin + this.$route.fullPath,
        text,
        title: "PlaySpace"
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
