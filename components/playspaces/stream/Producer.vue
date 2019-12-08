<template>
  <div>
    <div class="flex items-center justify-center w-full h-full">
      <video ref="video" id="local" class="w-full" autoplay muted playsinline></video>
    </div>
    <button @click="stopProduce" class="p-btn bg-red-400 text-white py-1 px-2">
      End Desktop Stream
    </button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    sendTransport: {
      required: true
    }
  },

  data: () => ({
    producer: null,
    stream: null
  }),

  mounted() {
    this.produce()
  },

  beforeDestroy() {
    this.stopProduce()
  },

  watch: {
    "$store.state.stream.video.producer"(track) {
      if (!track) {
        this.stopProduce()
      }
    }
  },

  methods: {
    ...mapActions({
      "setProducer": "stream/setProducer"
    }),

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
        this.stream = new MediaStream([this.$store.state.stream.video.producer])
        // this.$refs.video.srcObject = this.stream
        document.getElementById("local").srcObject = this.stream
      })

      this.producer = await this.sendTransport.produce({
        track: this.$store.state.stream.video.producer,
        codecOptions: {
          videoGoogleMaxBitrate: 3500
        }
      })

      this.$store.state.stream.video.producer.onended = this.stopProduce

      this.sockets.SFU.subscribe(`producer-stream-closed-${this.producer.id}`, () => {
        // TODO error handeling that your stream was closed
      })
    },

    stopProduce() {
      // Prevent this function from being called twice
      if (!this.producer) return
      
      // Tell SFU to delete producer
      this.$socket.SFU.emit("room-producer-close", this.producer.id)
      this.$refs.video.srcObject = null
      this.producer = null
      this.stream.getTracks().forEach(track => track.stop())
      this.setProducer({ type: "video", track: null })
    }
  }
}
</script>

<style>
</style>