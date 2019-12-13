<template>
  <div class="h-full w-full relative">
    <YoutubePlayer v-if="stream.type === 'youtube'" :src="src" :stream="stream" class="h-full w-full" />
    <iframe v-else :src="src" frameborder="0" class="w-full h-full"></iframe>
    <p-btn 
      @click="$socket.SFU.emit('room-stream-external-close', stream.id)" 
      variant="none" 
      size="sm" 
      class="absolute top-0 right-0 bg-red-400 m-2"
    >
      <p-icon icon="fas fa-minus" />
    </p-btn>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import YoutubePlayer from "./external/YoutubePlayer"

export default {
  components: {
    YoutubePlayer
  },

  props: {
    stream: {
      type: Object,
      required: true
    }
  },

  computed: {
    src() {
      switch(this.stream.type) {
        case 'twitch':
          return `https://player.twitch.tv/?channel=${this.stream.username}&enableExtensions=false`
        case 'youtube':
          return `https://www.youtube.com/embed/${this.stream.videoId}`
        default: 
          return ""
      }
    }
  },

  mounted() {
    this.sockets.SFU.subscribe(`room-stream-external-${this.stream.id}-closed`, () => {
      this.removeStream({ type: "external", stream: this.stream })
    })
  },

  methods: {
    ...mapActions({
      "removeStream": "stream/removeStream"
    })
  }
}
</script>

<style>

</style>