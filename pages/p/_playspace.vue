<template>
  <div :key="$route.params.playspace" class="playspace h-full" style="max-height:100%">
    <div class="visually-hidden">
      <h1>{{ playSpace.channelName }}</h1>
      <h2>{{ playSpace.title }}</h2>
    </div>
    <div class="flex flex-col h-full">
      <VideoContainer v-if="producerIds.length" :producerIds="producerIds" class="video-container p-2" />
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

import API from "@/api/api"
import con from "@/con"

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
    producerIds: []
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
    this.$socket.SFU.emit("room-transport-create")
  },

  sockets: {
    SFU: {
      "room-joined": async function(roomData) {
        const { routerRtpCapabilities } = roomData
        
        con.device = new Device()
        await con.device.load({ routerRtpCapabilities })

        if (!con.device.canProduce("video")) {
          return alert("You cant produce video")
        }
        if (!con.device.canProduce("audio")) {
          return alert("You cant produce audio")
        }

        this.producerIds = roomData.producerIds
      },

      "room-transport-created": async function(transportOptions) {
        con.sendTransport = await con.device.createSendTransport(transportOptions)
        con.recvTransport = await con.device.createRecvTransport(transportOptions)

        this.connectTransport(con.sendTransport)
        this.connectTransport(con.recvTransport)

        this.setSendTransport(con.sendTransport)
        this.setRecvTransport(con.recvTransport)
      }
    }
  },

  methods: {
    ...mapActions({
      "createDevice": "stream/createDevice",
      "setSendTransport": "stream/setSendTransport",
      "setRecvTransport": "stream/setRecvTransport"
    }),

    connectTransport(transport) {
      transport.on("connect", ({ dtlsParameters }, callback, errback) => {
        this.$socket.SFU.emit("room-transport-connect", {
          transportId: transport.id,
          dtlsParameters
        })

        this.sockets.SFU.subscribe("room-transport-connected", callback)
      })
    }
  }
}
</script>
