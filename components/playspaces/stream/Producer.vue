<template>
  <video ref="video" autoplay muted playsinline></video>
</template>

<script>
export default {
  props: {
    sendTransport: {
      required: true
    }
  },

  data: () => ({
    producer: null
  }),

  async mounted() {
    this.produce()
  },

  methods: {
    async produce() {
      this.sendTransport.on("produce", (params, callback, errback) => {
        this.$socket.SFU.emit("room-transport-produce", {
          producerOptions: {
            transportId: this.sendTransport.id,
            kind: params.kind,
            rtpParameters: params.rtpParameters
          },
          trackId: this.$store.state.stream.video.producer.id
        })

        this.sockets.SFU.subscribe(`room-transport-produced-${this.$store.state.stream.video.producer.id}`, callback)
        this.$refs.video.srcObject = new MediaStream([this.$store.state.stream.video.producer])
      })

      this.producer = await this.sendTransport.produce({
        track: this.$store.state.stream.video.producer,
        codecOptions: {
          videoGoogleMaxBitrate: 3500
        }
      })

      this.sockets.SFU.subscribe(`producer-stream-closed-${this.producer.id}`, () => {
        // TODO error handeling that your stream was closed
      })
    }
  }
}
</script>

<style>
</style>