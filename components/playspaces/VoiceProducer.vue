<template>
  <div class="flex items-center">
    <p-avatar
      avatar="https://i.imgur.com/cvrQlUP.png"
      size="sm"
      class="flex-shrink-0 mr-1"
    />
    <h3 class="flex-grow">
      {{ $store.state.user.fullUsername }}
    </h3>
    <button>
      <p-icon
        icon="fas fa-volume-mute"
        size="md"
        screen-reader-text="Mute"
        class="mr-5"
      />
    </button>
  </div>
</template>

<script>
export default {
  data: () => ({
    producer: null
  }),

  mounted() {
    this.produce()
  },

  beforeDestroy() {
    this.$socket.SFU.emit("room-producer-close", window.micProducer.id)
    this.$store.dispatch("stream/setLocalTrack", { type: "mic", track: null })
  },

  methods: {
    async produce() {
      window.sendTransport.on("produce", (params, callback, errback) => {
        this.$socket.SFU.emit("room-transport-produce", {
          producerOptions: {
            transportId: window.sendTransport.id,
            kind: params.kind,
            rtpParameters: params.rtpParameters
          },
          trackId: this.$store.state.stream.tracks.mic.id
        })

        this.sockets.SFU.subscribe(`room-transport-produced-${this.$store.state.stream.tracks.mic.id}`, callback)
      })

      this.producer = await window.sendTransport.produce({
        track: this.$store.state.stream.tracks.mic,
        codecOptions: {
          videoGoogleMaxBitrate: 128
        }
      })

      this.$socket.SFU.emit("room-stream-mic", {
        producerId: this.producer.id,
        username: this.$store.state.user.fullUsername
      })

      window.micProducer = this.producer

      this.sockets.SFU.subscribe(`producer-stream-closed-${this.producer.id}`, () => {
        // On producer closed (error)
      })
    }
  }
}
</script>

<style></style>
