<template>
  <div class="flex items-center justify-center">
    <div class="flex items-center justify-center w-full h-full">
      <video
        ref="video"
        id="local"
        class="w-full h-full"
        controls
        autoplay
        muted
        playsinline
      ></video>
    </div>
    <p-btn
      @click="stopProduce"
      variant="none"
      class="absolute p-btn bg-red-400 text-white py-1 px-2"
    >
      End Stream
    </p-btn>
  </div>
</template>

<script>
import { mapActions } from "vuex"
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
      setLocalTrack: "stream/setLocalTrack"
    }),

    // Produce this video stream
    async produce() {
      const videoTrack = this.$store.state.stream.tracks.video
      const audioTrack = this.$store.state.stream.tracks.audio

      this.stream = new MediaStream([videoTrack, audioTrack].filter(t => t))

      await this.produceVideo(videoTrack)
      await this.produceAudio(audioTrack)

      this.$socket.SFU.emit("room-stream-video", {
        producerId: this.videoProducer.id,
        audio: !audioTrack
          ? undefined
          : {
              producerId: this.audioProducer.id
            },
        username: this.$store.state.user.fullUsername
      })

      document.getElementById("local").srcObject = this.stream

      this.$store.state.stream.tracks.video.onended = this.stopProduce
    },

    async produceVideo(track) {
      if (!track) return

      this.videoProducer = await this.sendTransport.produce({
        track,
        codecOptions: {
          videoGoogleMaxBitrate: 4000
        }
      })

      this.sockets.SFU.subscribe(
        `producer-stream-closed-${this.videoProducer.id}`,
        this.stopProduce
      )
    },

    async produceAudio(track) {
      if (!track) return

      this.audioProducer = await this.sendTransport.produce({
        track,
        codecOptions: {
          videoGoogleMaxBitrate: 128
        }
      })

      this.sockets.SFU.subscribe(
        `producer-stream-closed-${this.audioProducer.id}`,
        () => {
          // TODO error handeling that your stream was closed
        }
      )
    },

    // Stop producing all tracks
    stopProduce() {
      // Close local video tracks
      if (this.stream) {
        let local = document.getElementById("local")
        if (local) local.srcObject = null
        this.stream.getTracks().forEach(track => track.stop())
      }

      // Delete server and local instance of video producer
      if (this.videoProducer) {
        this.$socket.SFU.emit("room-producer-close", this.videoProducer.id)
        this.videoProducer = null
      }

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

<style></style>
