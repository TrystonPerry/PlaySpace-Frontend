<template>
  <div class="bg-black-500 rounded-md overflow-y-auto scrollbar relative" id="chat">
    <ul class="list-style-none flex flex-col py-2">
      <li class="opacity-50 text-xs px-2">Welcome to the chat, say hi and start a conversation!</li>
      <ChatMessage v-for="(message, i) in messages" :key="i" :message="message" class="mb-1" />
      <ul v-if="disconnected" class="list-style-none text-center py-1">
        <p class="p-1 text-sm text-red-500">You have lost connection to chat.</p>
        <p-btn
          @click="attemptConnect"
          variant="none"
          class="bg-red-500 text-sm px-2"
          size="xs"
        >Reconnect</p-btn>
        <p-loading class="py-2" />
      </ul>
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
    isScrolled: true,
    disconnected: false
  }),

  mounted() {
    this.$socket.API.emit("chat-join", {
      id: this.$route.params.playspace
    })
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
        this.messages = this.messages.filter(msg => {
          return msg.username.toLowerCase() !== username
        })

        // TODO fix this code so it works

        // console.log(this.messages, username)
        // this.messages.forEach((message, i) => {
        //   if (message.username.toLowerCase() === username) {
        //     this.messages[i].isBanned = true
        //     this.messages[i].avatar = ""
        //   }
        // })
      },

      reconnect() {
        this.attemptConnect()
      },

      async disconnect() {
        this.disconnected = true
        await this.$nextTick()
        this.doScroll()
        this.$notify({
          type: "error",
          title: "Connection lost",
          text:
            "Lost connection to PlaySpace chat. Check your internet connection."
        })
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
    },

    attemptConnect() {
      // TODO store online status in vuex store
      if (!navigator.onLine) {
        this.$notify({
          type: "error",
          title: "Connection refused",
          text:
            "Check your internet connection, you apear to have gone offline."
        })
        return
      }

      if (this.$socket.API.connected) {
        this.$notify({
          type: "error",
          title: "Connection refused",
          text:
            "Can't connect to PlaySpace servers, this might be an error on our part."
        })
        return
      }

      this.messages = []
      this.$socket.API.emit("chat-join", { id: this.$route.params.playspace })
      this.disconnected = false

      this.$notify({
        type: "success",
        title: "Reconnected!",
        text: "You've regained connection to PlaySpace chat!"
      })
    }
  }
}
</script>

<style lang="scss" scoped>
ul {
  max-height: 1px;
}
</style>
