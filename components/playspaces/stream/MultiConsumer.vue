<template>
  <video ref="video" id="video" autoplay muted playsinline></video>
</template>

<script>
export default {
  props: {
    producerIds: {
      type: Array,
      required: true
    },
    device: {
      required: true
    },
    recvTransport: {
      required: true
    }
  },

  data: () => ({
    producerId: "",
    producers: [],
    consumer: null,
    track: null
  }),

  mounted() {
    this.producerId = this.producerIds[0]
    this.consume(this.producerId)
  },

  methods: {
    async consume(producerId) {
      this.$socket.SFU.emit("room-transport-consume", {
        producerId,
        rtpCapabilities: this.device.rtpCapabilities
      })

      this.sockets.SFU.subscribe(
        `room-transport-consumed-${producerId}`,
        async consumerOptions => {
          this.consumer = await this.recvTransport.consume(consumerOptions)

          const { track } = this.consumer
          this.track = track
          const video = document.getElementById("video")
          video.srcObject = new MediaStream([this.track])

          this.$socket.SFU.emit("room-consumer-pause", {
            consumerId: this.consumer.id,
            state: 'resume'
          })

          this.$emit("connect")
        }
      )
    }
  }
}
</script>

<style>

</style>