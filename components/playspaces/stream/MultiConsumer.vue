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
        :muted="muted"
        autoplay
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
      >{{ stream.username | truncate(4) }}</p-btn>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex"

export default {
  data: () => ({
    activeProducerId: "",
    consumers: {},
    muted: false
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
      this.$socket.SFU.emit("room-consumer-pause", {
        consumerId: consumer.id,
        state: "resume"
      })
      setTimeout(() => {
        const lastConsumer = this.consumers[lastProducerId]
        this.$refs[`video-container-${producerId}`][0].style.zIndex = 1
        if (lastProducerId) {
          this.$refs[`video-container-${lastProducerId}`][0].style.zIndex = -1
        }
        if (lastConsumer) {
          this.$socket.SFU.emit("room-consumer-pause", {
            consumerId: lastConsumer.id,
            state: "pause"
          })
        }
      }, 200)
    },

    "$store.state.stream.isSoundBlocked"(value) {
      if (value === false) {
        this.muted = false
        this.$store.state.stream.streams.video.forEach(stream => {
          const video = document.getElementById(`video-${stream.producerId}`)
          video.play()
        })
      }
    }
  },

  methods: {
    ...mapActions({
      removeStream: "stream/removeStream"
    }),

    async consume(stream) {
      const { producerId } = stream

      await this.consumeVideo(producerId)
      if (stream.audio) {
        await this.consumeAudio(stream.audio.producerId)
      }

      const videoTrack = this.consumers[producerId].track
      let audioTrack
      if (stream.audio) {
        audioTrack = this.consumers[stream.audio.producerId].track
      }

      const mediaStream = new MediaStream(
        [videoTrack, audioTrack].filter(t => t)
      )
      const video = document.getElementById(`video-${producerId}`)
      video.srcObject = mediaStream

      this.$store.dispatch("nav/updateVideoContainer")

      this.sockets.SFU.subscribe(`producer-stream-closed-${producerId}`, () => {
        // CRITICAL TODO tell server to delete this consumer (maybe have server delete all consumers based on that closed producer anyways)
        delete this.consumers[producerId]
        if (stream.audio) {
          delete this.consumers[stream.audio.producerId]
        }

        if (this.streams.length) {
          const random = Math.floor(Math.random() * this.streams.length)
          this.activeProducerId = this.streams[random].producerId
        } else {
          this.activeProducerId = ""
        }

        this.removeStream({ type: "video", stream })
      })

      try {
        await video.play()
      } catch (err) {
        this.muted = true
        video.play().catch()
        this.$store.dispatch("stream/setIsSoundBlocked", true)
        return
      }

      this.muted = false
    },

    async consumeVideo(producerId) {
      return await new Promise((resolve, reject) => {
        this.$socket.SFU.emit("room-transport-consume", {
          producerId,
          rtpCapabilities: this.device.rtpCapabilities
        })

        this.sockets.SFU.subscribe(
          `room-transport-consumed-${producerId}`,
          async consumerOptions => {
            const videoConsumer = await this.$con.recvTransport.consume(
              consumerOptions
            )
            this.consumers[producerId] = videoConsumer

            this.activeProducerId = producerId

            this.$socket.SFU.emit("room-consumer-pause", {
              consumerId: videoConsumer.id,
              state: "resume"
            })

            resolve()
          }
        )
      })
    },

    async consumeAudio(producerId) {
      return await new Promise((resolve, reject) => {
        this.$socket.SFU.emit("room-transport-consume", {
          producerId,
          rtpCapabilities: this.device.rtpCapabilities
        })

        this.sockets.SFU.subscribe(
          `room-transport-consumed-${producerId}`,
          async consumerOptions => {
            const audioConsumer = await this.$con.recvTransport.consume(
              consumerOptions
            )
            this.consumers[producerId] = audioConsumer

            this.$socket.SFU.emit("room-consumer-pause", {
              consumerId: audioConsumer.id,
              state: "resume"
            })

            resolve()
          }
        )
      })
    }
  },

  sockets: {
    SFU: {
      "room-stream-video": function(stream) {
        this.consume(stream)
      }
    }
  }
}
</script>

<style>
</style>