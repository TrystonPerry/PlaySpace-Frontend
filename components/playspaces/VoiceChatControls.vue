<template>
  <div v-if="isStreamer">
    <div
      v-if="!$store.state.stream.tracks.mic && chatterCount < $store.state.playSpace.current.maxAudioStreams"
    >
      <p-btn @click="getMic" variant="none" size="sm" class="text-sm w-full">
        <p-icon icon="fas fa-phone" class="text-xs" />Join Chat
      </p-btn>
    </div>
    <div v-else-if="$store.state.stream.tracks.mic">
      <p-btn @click="closeMic" variant="none" size="sm" class="text-sm w-full">
        <p-icon icon="fas fa-phone-slash" class="text-xs" />Leave Chat
      </p-btn>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

import WebRTC from "@/functions/webrtc"

export default {
  data: () => ({
    track: null
  }),

  beforeDestroy() {
    this.closeMic()
  },

  computed: {
    ...mapGetters({
      isStreamer: "playSpace/isStreamer"
    }),

    chatterCount() {
      return (
        this.$store.state.stream.streams.mic.length +
        !!this.$store.state.stream.tracks.mic
      )
    }
  },

  watch: {
    "$store.state.stream.producerIds.mic"(producerId) {
      if (producerId) {
        this.sockets.SFU.subscribe(
          `producer-stream-closed-${producerId}`,
          this.closeMic
        )
      }
    }
  },

  methods: {
    ...mapActions({
      setLocalTrack: "stream/setLocalTrack",
      removeLocalStream: "stream/removeLocalStream"
    }),

    async getMic() {
      const constraints = {
        audio: true
      }

      const res = await WebRTC.getUserMedia(constraints)

      if (!res.success) {
        this.$notify({
          type: "error",
          title: "Error getting your microphone",
          text: res.error
        })
        return
      }

      this.track = res.stream.getAudioTracks()[0]

      this.setLocalTrack({ type: "mic", track: this.track })
    },

    closeMic() {
      if (this.$con.micProducer) {
        this.closeMicProducer()
      }
      if (this.track) {
        this.track.stop()
        this.track = null
        this.setLocalTrack({ type: "mic", track: null })
      }
    },

    closeMicProducer() {
      this.$socket.SFU.emit(
        "room-producer-close",
        this.$store.state.stream.producerIds.mic
      )
      this.$con.micProducer.close()
    }
  }
}
</script>

<style>
</style>