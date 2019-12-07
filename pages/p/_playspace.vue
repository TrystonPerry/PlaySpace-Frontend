<template>
  <div :key="$route.params.playspace" class="playspace h-full" style="max-height:100%">
    <div class="visually-hidden">
      <h1>{{ playSpace.channelName }}</h1>
      <h2>{{ playSpace.title }}</h2>
    </div>
    <div class="flex flex-col h-full">
      <VideoContainer :producerIds="producerIds" :device="device" :sendTransport="sendTransport" :recvTransport="recvTransport" class="video-container p-2" />
      <PlaySpaceMobileSidebar
        v-if="$store.state.nav.isMobile"
        :key="$route.params.playspace"
        class="flex-grow mt-2"
      />
    </div>
  </div>
</template>

<script>
import { Device } from "mediasoup-client"
import { mapActions } from "vuex"

import Vue from "vue"
import API from "@/api/api"

import VideoContainer from "@/components/playspaces/VideoContainer"
import PlaySpaceMobileSidebar from "@/components/navigation/PlaySpaceMobileSidebar"

export default {
  layout: "app",

  components: {
    VideoContainer,
    PlaySpaceMobileSidebar
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
    this.$notify("Hello World")
  },

  beforeDestroy() {
    this.$socket.SFU.emit("room-leave")
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
      this.sockets.SFU.subscribe(`producer-stream-closed-${producerId}`, () => {
        this.producerIds.splice(this.producerIds.indexOf(producerId), 1)
      })
    }
  }
}
</script>
