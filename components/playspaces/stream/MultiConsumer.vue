<template>
  <video ref="video" id="video" autoplay muted playsinline></video>
</template>

<script>
import { mapActions } from "vuex"

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
    consumers: {},
    track: null
  }),

  mounted() {
    this.producerId = this.producerIds[0]
    this.consume(this.producerId)
  },

  methods: {
    ...mapActions({
      "setConsumer": "stream/setConsumer"
    }),

    async consume(producerId) {
      this.$socket.SFU.emit("room-transport-consume", {
        producerId,
        rtpCapabilities: this.device.rtpCapabilities
      })

      this.sockets.SFU.subscribe(
        `room-transport-consumed-${producerId}`,
        async consumerOptions => {

          const consumer = await this.recvTransport.consume(consumerOptions)
          this.consumers[producerId] = consumer

          const { track } = consumer
          this.track = track

          this.setConsumer({ type: "video", producerId, track })

          const video = document.getElementById("video")
          video.srcObject = new MediaStream([this.track])

          this.$socket.SFU.emit("room-consumer-pause", {
            consumerId: consumer.id,
            state: 'resume'
          })

          this.sockets.SFU.subscribe(`producer-stream-closed-${producerId}`, () => {
            // CRITICAL TODO tell server to delete this consumer (maybe have server delete all consumers based on that closed producer anyways)
            delete this.consumers[producerId]
            this.setConsumer({ type: "video", producerId })
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