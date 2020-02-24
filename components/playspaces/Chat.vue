<template>
  <div
    class="bg-black-500 rounded-md overflow-y-auto scrollbar relative"
    id="chat"
  >
    <ul class="list-style-none flex flex-col py-2">
      <li class="opacity-50 text-xs px-2">
        Welcome to the chat, say hi and start a conversation!
      </li>
      <ChatMessage
        v-for="(message, i) in messages"
        :key="i"
        :message="message"
        class="mb-1"
      />
      <ul v-if="disconnected" class="list-style-none text-center py-1">
        <p class="p-1 text-sm text-red-500">
          You have lost connection to chat.
        </p>
        <p-btn
          @click="attemptConnect"
          variant="none"
          class="bg-red-500 text-sm px-2"
          size="xs"
          >Reconnect</p-btn
        >
        <p-loading class="py-2" />
      </ul>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex"

import ChatMessage from "./ChatMessage"

export default {
  components: {
    ChatMessage
  },

  data: () => ({
    isScrolled: true,
    disconnected: false
  }),

  computed: {
    ...mapState({
      messages: state => state.chat.messages
    })
  },

  sockets: {
    API: {
      "chat-message"(messages) {
        const chat = document.getElementById("chat")
        const shouldScroll =
          chat.scrollTop > chat.scrollHeight - chat.clientHeight - 200

        if (shouldScroll) {
          setTimeout(this.doScroll, 100)
        } else {
          this.isScrolled = false
        }
      },

      "chat-ban"(username) {
        this.$store.commit("chat/BAN_MESSAGES_BY_USERNAME", username)
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
