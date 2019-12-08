<template>
  <div class="relative">
    <div v-for="producerId in producerIds" :key="`video-container-${producerId}`" :ref="`video-container-${producerId}`"  class="absolute w-full h-full flex items-center justify-center">
      <video 
        :id="`video-${producerId}`" 
        autoplay 
        muted 
        playsinline
        controls
        class="w-full"
      ></video>
      <!-- :class="activeProducerId === producerId ? 'block' : 'hidden'"  -->      
    </div>
    <div class="absolute bottom-0 text-center w-full pb-2" style="z-index:10">
      <p-btn 
        v-for="producerId in producerIds" 
        :key="producerId" 
        :variant="activeProducerId === producerId ? 'primary' : 'primary-hover'"
        @click="activeProducerId = producerId"
        size="xs"
      >
        {{ producerId | truncate(4) }}
      </p-btn>
    </div>
  </div>
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
    activeProducerId: "",
    consumers: {}
  }),

  mounted() {
    this.producerIds.forEach(this.consume)
  },

  watch: {
    producerIds(producerIds) {
      console.log(producerIds)
      const oldProducerIds = Object.keys(this.consumers)
      if (producerIds.length > oldProducerIds.length) {
        let newItems = 0
        for (let i = 0; i < producerIds.length; i++) {
          if (producerIds[i] !== oldProducerIds[i - newItems]) {

            this.consume(producerIds[i])
            newItems++
          }
        }
      }
    },

    async activeProducerId(producerId, lastProducerId) {
      const track = this.$store.state.stream.video.consumers[producerId]
      if (!track) return
      const consumer = this.consumers[producerId]
      this.$socket.SFU.emit("room-consumer-pause", { consumerId: consumer.id, state: "resume" })
      setTimeout(() => {
        const lastConsumer = this.consumers[lastProducerId]
        this.$refs[`video-container-${producerId}`][0].style.zIndex = 1
        if (lastProducerId) {
          this.$refs[`video-container-${lastProducerId}`][0].style.zIndex = -1
        }
        if (lastConsumer) {
          this.$socket.SFU.emit("room-consumer-pause", { consumerId: lastConsumer.id, state: "pause" })
        }
      }, 200)
    }
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

          this.activeProducerId = producerId
          this.setConsumer({ type: "video", producerId, track })

          document.getElementById(`video-${producerId}`).srcObject = new MediaStream([track])

          this.$socket.SFU.emit("room-consumer-pause", {
            consumerId: consumer.id,
            state: 'resume'
          })

          this.sockets.SFU.subscribe(`producer-stream-closed-${producerId}`, () => {
            // CRITICAL TODO tell server to delete this consumer (maybe have server delete all consumers based on that closed producer anyways)
            delete this.consumers[producerId]
            const random = Math.floor(Math.random() * this.producerIds.length)
            this.activeProducerId = this.producerIds[random]
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