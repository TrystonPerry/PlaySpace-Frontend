<template>
  <div class="flex items-center">
    <p-avatar
      avatar="https://i.imgur.com/cvrQlUP.png"
      size="sm"
      class="flex-shrink-0 mr-1"
    />
    <h3 class="flex-grow font-bold">
      {{ mic.username }}
    </h3>
    <p-btn
      @click="toggleMute"
      variant="none"
      size="xs"
    >
      <p-icon
        icon="fas fa-volume-mute"
        size="md"
        screen-reader-text="Toggle Mute"
        class="mr-5"
        :class="{ 'text-red-600': muted }"
      />
    </p-btn>
    <audio :muted="muted" :id="mic.producerId" />
  </div>
</template>

<script>
import { mapActions } from "vuex"

export default {
  props: {
    mic: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    consumer: null,
    muted: true
  }),

  async mounted() {
    // TODO fix this shit code
    if (!window.recvTransport) {
      await new Promise(resolve => {
        setTimeout(() => resolve(), 1000)
      })
    }

    this.consume(this.mic)
  },

  methods: {
    ...mapActions({
      "removeStream": "stream/removeStream"
    }),

    async consume(stream) {
      const { producerId } = stream

      await this.consumeMic(producerId)

      const audioPlayer = document.getElementById(this.mic.producerId)

      audioPlayer.srcObject = new MediaStream([this.consumer.track])
      audioPlayer.play()

      this.muted = false

      // Subscribe to on stream ended
      this.sockets.SFU.subscribe(`producer-stream-closed-${producerId}`, () => {
        this.removeStream({ type: "mic", stream })
      })
    },

    async consumeMic(producerId) {
      return await new Promise((resolve, reject) => {
        this.$socket.SFU.emit("room-transport-consume", {
          producerId,
          rtpCapabilities: window.device.rtpCapabilities
        })

        this.sockets.SFU.subscribe(
          `room-transport-consumed-${producerId}`,
          async consumerOptions => {

            // TODO figure out why this code is run multiple times when switching
            // between playspaces
            if (this.consumer) return
            
            this.consumer = await window.recvTransport.consume(consumerOptions)

            this.$socket.SFU.emit("room-consumer-pause", {
              consumerId: this.consumer.id,
              state: 'resume'
            })

            resolve()
          }
        )
      })
    },

    toggleMute() {
      const state = this.muted ? 'resume' : "pause"
      this.muted = !this.muted
      this.$socket.SFU.emit("room-consumer-pause", {
        consumerId: this.consumer.id,
        state
      })
    }
  }
}
</script>

<style></style>
