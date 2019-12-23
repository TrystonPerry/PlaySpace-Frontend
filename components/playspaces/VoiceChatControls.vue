<template>
  <div v-if="$store.state.user.username && isStreamer">
    <div v-if="!$store.state.stream.tracks.mic && chatterCount < $store.state.playSpace.current.maxAudioStreams">
      <p-btn @click="getMic" variant="none" size="sm" class="text-sm w-full">
        <p-icon icon="fas fa-phone" class="text-xs" />
        Join Chat
      </p-btn>
    </div>
    <div v-else-if="$store.state.stream.tracks.mic">
      <p-btn @click="closeMic" variant="none" size="sm" class="text-sm w-full">
        <p-icon icon="fas fa-muted" class="text-xs" />
        Leave Chat
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
      "isStreamer": "playSpace/isStreamer"
    }),

    chatterCount() {
      return this.$store.state.stream.streams.mic.length + !!this.$store.state.stream.tracks.mic
    }
  },

  methods: {
    ...mapActions({
      "setLocalTrack": "stream/setLocalTrack",
      "removeLocalStream": "stream/removeLocalStream"
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
      if (!this.track) return
      this.track.stop()
      this.$socket.SFU.emit("room-producer-close", window.micProducer.id)
      this.setLocalTrack({ type: "mic", track: null })
    }
  }
}
</script>

<style>

</style>