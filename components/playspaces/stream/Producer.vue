<template>
  <div class="flex items-center justify-center">
    <div class="flex items-center justify-center w-full h-full">
      <video ref="video" id="local" class="w-full h-full" autoplay muted playsinline></video>
    </div>
    <button @click="stopProduce" class="absolute p-btn bg-red-400 text-white py-1 px-2">
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
    videoProducer: null,
    audioProducer: null,
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
      "setLocalTrack": "stream/setLocalTrack"
    }),

    async produce() {
      this.sendTransport.on("produce", (params, callback, errback) => {
        this.$socket.SFU.emit("room-transport-produce", {
          producerOptions: {
            transportId: this.sendTransport.id,
            kind: params.kind,
            rtpParameters: params.rtpParameters
          },
          trackId: this.$store.state.stream.tracks[params.kind].id
        })

        this.sockets.SFU.subscribe(`room-transport-produced-${this.$store.state.stream.tracks[params.kind].id}`, callback)
      })

      const videoTrack = this.$store.state.stream.tracks.video
      const audioTrack = this.$store.state.stream.tracks.audio
      await this.produceVideo(videoTrack)
      await this.produceAudio(audioTrack)

      this.$socket.SFU.emit("room-stream-video", {
        producerId: this.videoProducer.id,
        audio: !audioTrack ? undefined : {
          producerId: this.audioProducer.id
        }
      })

      this.stream = new MediaStream([videoTrack, audioTrack].filter(t => t))
      document.getElementById("local").srcObject = this.stream

      this.$store.state.stream.tracks.video.onended = this.stopProduce
    },

    async produceVideo(track) {
      if (!track) return

      this.videoProducer = await this.sendTransport.produce({
        track,
        codecOptions: {
          videoGoogleMaxBitrate: 3500
        }
      })

      this.sockets.SFU.subscribe(`producer-stream-closed-${this.videoProducer.id}`, () => {
        // TODO error handeling that your stream was closed
      })
    },

    async produceAudio(track) {
      if (!track) return

      this.audioProducer = await this.sendTransport.produce({
        track,
        codecOptions: {
          videoGoogleMaxBitrate: 128
        }
      })

      this.sockets.SFU.subscribe(`producer-stream-closed-${this.audioProducer.id}`, () => {
        // TODO error handeling that your stream was closed
      })
    },

    // Stop producing all tracks
    stopProduce() {
      // Prevent this function from being called multiple times
      if (!this.videoProducer) return

      // Close local video tracks
      this.$refs.video.srcObject = null
      this.stream.getTracks().forEach(track => track.stop())

      // Delete server and local instance of video producer
      this.$socket.SFU.emit("room-producer-close", this.videoProducer.id)
      this.videoProducer = null

      // Delete server and local instance of audio producer
      if (this.audioProducer) {
        this.$socket.SFU.emit("room-producer-close", this.audioProducer.id)
        this.audioProducer = null
      }

      // Remove tracks from store
      this.setLocalTrack({ type: "video", track: null })
      this.setLocalTrack({ type: "audio", track: null })
    }
  }
}
</script>

<style>
</style>