<template>
  <div class="relative">
    <div 
      v-for="stream in streams" 
      :key="`video-container-${stream.producerId}`" 
      :ref="`video-container-${stream.producerId}`"  
      class="absolute w-full h-full flex items-center justify-center"
    >
      <video 
        :id="`video-${stream.producerId}`" 
        autoplay 
        muted 
        playsinline
        controls
        class="w-full h-full"
      ></video>
    </div>
    <div class="absolute bottom-0 text-center w-full pb-2" style="z-index:10">
      <p-btn 
        v-for="stream in streams" 
        :key="stream.producerId" 
        :variant="activeProducerId === stream.producerId ? 'primary' : 'primary-hover'"
        @click="activeProducerId = stream.producerId"
        size="xs"
      >
        {{ stream.producerId | truncate(4) }}
      </p-btn>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex"

export default {
  props: {
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

  computed: {
    streams() {
      return this.$store.state.stream.streams.video
    }
  },

  mounted() {
    this.$store.state.stream.streams.video.forEach(this.consume)
  },

  watch: {
    async activeProducerId(producerId, lastProducerId) {
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
      "removeStream": "stream/removeStream"
    }),

    async consume(stream) {
      const { producerId } = stream

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

          document.getElementById(`video-${producerId}`).srcObject = new MediaStream([track])

          this.$socket.SFU.emit("room-consumer-pause", {
            consumerId: consumer.id,
            state: 'resume'
          })

          this.$store.dispatch("nav/updateVideoContainer")

          this.sockets.SFU.subscribe(`producer-stream-closed-${producerId}`, () => {
            // CRITICAL TODO tell server to delete this consumer (maybe have server delete all consumers based on that closed producer anyways)
            delete this.consumers[producerId]

            const random = Math.floor(Math.random() * this.streams.length)
            this.activeProducerId = this.streams[random].producerId

            this.removeStream({ type: "video", stream })
          })
        }
      )
    }
  },

  sockets: {
    SFU: {
      "producer-stream": function(stream) {
        this.consume(stream)
      }
    }
  }
}
</script>

<style>

</style>