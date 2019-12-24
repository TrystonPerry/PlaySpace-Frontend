<template>
  <div class="flex items-center">
    <p-avatar
      avatar="https://i.imgur.com/cvrQlUP.png"
      size="sm"
      class="flex-shrink-0 mr-1"
    />
    <h3 class="flex-grow font-bold">
      {{ $store.state.user.fullUsername }}
    </h3>
    <p-btn
      @click="toggleMute"
      variant="none"
      size="xs"
    >
      <p-icon
        icon="fas fa-microphone-slash"
        size="md"
        screen-reader-text="Toggle Mute"
        class="mr-5"
        :class="{ 'text-red-600': muted }"
      />
    </p-btn>
  </div>
</template>

<script>
export default {
  data: () => ({
    producer: null,
    muted: false
  }),

  mounted() {
    this.produce()
  },

  beforeDestroy() {
    window.micProducer = null
  },

  methods: {
    async produce() {
      this.producer = await window.sendTransport.produce({
        track: this.$store.state.stream.tracks.mic,
        codecOptions: {
          videoGoogleMaxBitrate: 128
        }
      })

      window.micProducer = this.producer

      this.$socket.SFU.emit("room-stream-mic", {
        producerId: this.producer.id,
        username: this.$store.state.user.fullUsername
      })

      this.sockets.SFU.subscribe(`producer-stream-closed-${this.producer.id}`, () => {
        // On producer closed (error)
      })
    },

    toggleMute() {
      const state = this.muted ? 'resume' : "pause"
      this.muted = !this.muted
      this.$socket.SFU.emit("room-producer-pause", {
        producerId: this.producer.id,
        state
      })
    }
  }
}
</script>

<style></style>
