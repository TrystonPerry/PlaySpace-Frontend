<template>
  <div class="relative">
    <textarea
      v-model="text"
      @keydown.enter="sendMessage"
      class="w-full h-24 rounded-md bg-black-500 hover:bg-black-400 text-xs p-1"
      placeholder="Enter a message..."
    >
    </textarea>
    <div class="absolute flex bottom-0 right-0 py-2 px-1 items-center">
      <p-btn variant="none" size="xs" class="text-gray-200 mr-1">
        <p-icon icon="far fa-smile" size="sm" />
      </p-btn>
      <p-btn
        variant="none"
        size="xs"
        class="text-gray-200 text-xs font-medium h-4 mr-1 rounded"
      >
        GIF
      </p-btn>
      <p-btn
        @click="sendMessage"
        variant="primary"
        size="xs"
        class="text-xs px-2"
      >
        Send
      </p-btn>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    text: ""
  }),

  computed: {
    isLoggedIn() {
      return !!this.$store.state.user.username
    }
  },

  watch: {
    "$store.state.user.token": {
      handler(token) {
        if (token) {
          this.$socket.API.emit("chat-auth", {
            id: this.$route.params.playspace,
            token
          })
        }
      },
      immediate: true
    }
  },

  methods: {
    sendMessage() {
      try {
        this.$socket.API.emit("chat-message", this.text)
      } catch (err) {
        console.error(err)
      }
      this.message = ""
    },

    checkMessage() {}
  }
}
</script>

<style lang="scss" scoped>
textarea {
  transition-duration: 100ms;
}
</style>
