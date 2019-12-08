<template>
  <div :key="$route.params.playspace" class="relative playspace h-full" style="max-height:100%">
    <div class="visually-hidden">
      <h1>{{ playSpace.channelName }}</h1>
      <h2>{{ playSpace.title }}</h2>
    </div>
    <div class="flex flex-col h-full">
      <client-only>
        <div v-if="!$store.state.stream.totalVideos" class="text-center text-gray-300 my-5">
          <h3 class="text-2xl font-bold">It's lonely here :(</h3>
          <h4>Click below to share your desktop, a YouTube video, or Twitch Stream</h4>
          <AddVideoStream class="max-w-48 w-full mx-auto mt-5" />
        </div>
      </client-only>

      <VideoContainer 
        :producerIds="producerIds" 
        :device="device" 
        :sendTransport="sendTransport" 
        :recvTransport="recvTransport" 
        class="video-container" 
      />
      <PlaySpaceMobileSidebar
        v-if="$store.state.nav.isMobile"
        :key="$route.params.playspace"
        class="flex-grow mt-2"
      />
    </div>
    <AddVideoStream v-if="$store.state.stream.totalVideos" drop-up class="absolute bottom-0 left-0 m-2" />
  </div>
</template>

<script>
import { Device } from "mediasoup-client"
import { mapActions } from "vuex"

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
    producerIds: [],
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
  },

  beforeDestroy() {
    this.$socket.SFU.emit("room-leave")
    this.setTotalVideos(0)
    this.reset()
  },

  sockets: {
    SFU: {
      "room-joined": async function(roomData) {
        const { routerRtpCapabilities } = roomData
        
        this.device = new Device()
        await this.device.load({ routerRtpCapabilities })

        if (!this.device.canProduce("video")) {
          return alert("You cant produce video")
        }
        if (!this.device.canProduce("audio")) {
          return alert("You cant produce audio")
        }

        this.$socket.SFU.emit("room-transport-create", "send")
        this.$socket.SFU.emit("room-transport-create", "recv")

        this.producerIds = roomData.producerIds
        this.producerIds.forEach(this.subscribeToProducerClosed)
      },

      "room-sendtransport-created": async function(transportOptions) {
        this.sendTransport = await this.device.createSendTransport(transportOptions)
        this.connectTransport(this.sendTransport)
      },

      "room-recvtransport-created": async function(transportOptions) {
        this.recvTransport = await this.device.createRecvTransport(transportOptions)
        this.connectTransport(this.recvTransport)
      },

      "producer-stream": async function(producerOptions) {
        const { id } = producerOptions
        this.producerIds.push(id)
        this.subscribeToProducerClosed(id)
      },

      disconnect() {
        this.producerIds = []
      },

      reconnect() {
        this.$socket.SFU.emit("room-join", { roomId: this.$route.params.playspace })
      }
    },
  },

  methods: {
    ...mapActions({
      "setTotalVideos": "stream/setTotalVideos",
      "decrementTotalVideos": "stream/decrementTotalVideos",
      "incrementTotalVideos": "stream/incrementTotalVideos",
      "reset": "stream/reset"
    }),

    connectTransport(transport) {
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

    subscribeToProducerClosed(producerId) {
      this.incrementTotalVideos()
      this.sockets.SFU.subscribe(`producer-stream-closed-${producerId}`, () => {
        this.decrementTotalVideos()
        this.producerIds.splice(this.producerIds.indexOf(producerId), 1)
      })
    }
  }
}
</script>
