<template>
  <div class="h-full w-full relative">
    <iframe :src="src" frameborder="0" class="w-full h-full"></iframe>
    <p-btn @click="$socket.SFU.emit('room-stream-external-close', stream.id)" variant="none" class="absolute top-0 right-0 bg-red-400">
      <p-icon icon="fas fa-minus" />
    </p-btn>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    stream: {
      type: Object,
      required: true
    }
  },

  computed: {
    src() {
      if (!this.stream && !this.stream.type) {
        return ""
      }
      switch(this.stream.type) {
        case 'twitch':
          return `https://player.twitch.tv/?channel=${this.stream.id}&enableExtensions=false`
        case 'youtube':
          return `https://www.youtube.com/embed/${this.stream.id}`
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