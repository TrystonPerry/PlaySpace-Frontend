<template>
  <div class="bg-black-500 rounded-md overflow-y-auto scrollbar relative" id="chat">
    <ul class="list-style-none flex flex-col">
      <ChatMessage v-for="(message, i) in messages" :key="i" :message="message" />
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
    messages: [],
    isScrolled: true
  }),

  mounted() {
    this.$socket.API.emit("chat-join", { id: this.$route.params.playspace })
  },

  beforeDestroy() {
    this.$socket.API.emit("chat-leave")
  },

  sockets: {
    API: {
      "chat-message"(messages) {
        if (this.messages.length > 99) {
          this.messages.shift()
        }

        const chat = document.getElementById("chat")
        const shouldScroll =
          chat.scrollTop > chat.scrollHeight - chat.clientHeight - 200

        messages.forEach(message => {
          this.messages.push(message)
        })

        if (shouldScroll) {
          setTimeout(this.doScroll, 100)
        } else {
          this.isScrolled = false
        }
      },

      "chat-ban"(username) {
        this.messages.forEach((message, i) => {
          if (message.username === username) {
            this.messages[i].isBanned = true
            this.messages[i].avatar = ""
          }
        })
      },

      reconnect() {
        this.$socket.API.emit("chat-join", { id: this.$route.params.playspace })
      }
    }
  },

  methods: {
    doScroll() {
      const chat = document.getElementById("chat")

      this.isScrolled = true

      if (!chat.scrollTo) {
        chat.scrollTop = chat.scrollHeight
      } else {
        chat.scrollTo({
          top: chat.scrollHeight,
          left: 0,
          behavior: "smooth"
        })
      }
    }
  }
}
</script>

<style></style>
