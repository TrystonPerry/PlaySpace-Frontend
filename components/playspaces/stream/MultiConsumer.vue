<template>
  <video ref="video" id="video" autoplay muted playsinline></video>
</template>

<script>
import con from "@/con"

export default {
  props: {
    producerIds: {
      type: Array,
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
        rtpCapabilities: con.device.rtpCapabilities
      })

      this.sockets.SFU.subscribe(
        `room-transport-consumed-${producerId}`,
        async consumerOptions => {
          this.consumer = await con.recvTransport.consume(consumerOptions)

          const { track } = this.consumer
          this.track = track
          const video = document.getElementById("video")
          video.srcObject = new MediaStream([this.track])

          this.$socket.SFU.emit("room-consumer-pause", {
            consumerId: this.consumer.id,
            state: 'resume'
          })
        }
      )
    }
  }
}
</script>

<style>

</style>