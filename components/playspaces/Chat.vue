<template>
  <div class="bg-black-500 rounded-md overflow-y-auto scrollbar">
    <ul class="list-style-none flex flex-col">
      <ChatMessage
        v-for="(message, i) in messages"
        :key="i"
        :message="message"
      />
    </ul>
  </div>
</template>

<script>
import ChatMessage from "./ChatMessage"

export default {
  components: {
    ChatMessage
  },

  data: () => ({
    messages: []
  }),

  mounted() {
    this.$socket.API.emit("chat-join", { id: this.$route.params.playspace })
  },

  beforeDestroy() {
    this.$socket.API.emit("chat-leave")
  },

  sockets: {
    API: {
      "chat-message"(message) {
        this.messages.push(...message)
      }
    }
  }
}
</script>

<style></style>
