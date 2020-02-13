<template>
  <div class="flex items-center">
    <p-avatar avatar="https://i.imgur.com/cvrQlUP.png" size="sm" class="flex-shrink-0 mr-1" />
    <h3 class="flex-grow font-bold">{{ fullUsername }}</h3>
    <p-btn @click="toggleMute" variant="none" size="xs">
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
    muted: false
  }),

  mounted() {
    this.produce()
  },

  beforeDestroy() {
    this.$con.micProducer = null
  },

  computed: {
    fullUsername() {
      return this.$store.state.user.fullUsername || "Anonymous"
    }
  },

  methods: {
    async produce() {
      this.$con.micProducer = await this.$con.sendTransport.produce({
        track: this.$store.state.stream.tracks.mic,
        codecOptions: {
          videoGoogleMaxBitrate: 128
        }
      })

      this.$socket.SFU.emit("room-stream-mic", {
        producerId: this.$con.micProducer.id,
        username: this.fullUsername
      })

      this.$store.dispatch("stream/setProducerId", {
        type: "mic",
        producerId: this.$con.micProducer.id
      })

      this.sockets.SFU.subscribe(
        `producer-stream-closed-${this.$con.micProducer.id}`,
        () => {
          // On producer closed (error)
        }
      )
    },

    toggleMute() {
      const state = this.muted ? "resume" : "pause"
      this.muted = !this.muted
      this.$con.micProducer[state]()
    }
  }
}
</script>

<style></style>
