<template>
  <div>
    <YoutubePlayer v-if="stream.type === 'youtube'" :src="src" :stream="stream" class="h-full w-full" />
    <div v-else @mouseenter="controls = true" @mouseleave="controls = false" class="relative h-full w-full">
      <iframe :src="src" frameborder="0" class="w-full h-full"></iframe>
      <div v-if="controls" class="absolute right-0 mr-1" style="top:50%;transform:translateY(-50%)">
      <p-tooltip text="Remove Player" position="left">
        <p-btn 
          @click="$socket.SFU.emit('room-stream-external-close', stream.id)" 
          variant="none" 
          size="sm" 
          class="bg-red-400"
        >
          <p-icon icon="fas fa-minus" />
        </p-btn>
      </p-tooltip>
    </div>
    </div>
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

  data: () => ({
    controls: false
  }),

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