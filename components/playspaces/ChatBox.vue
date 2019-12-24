<template>
  <div class="relative">
    <small v-if="errors.text" class="text-red-500">{{ errors.text }}</small>
    <textarea
      v-model="text"
      @keydown.prevent.enter="sendMessage"
      class="w-full h-24 rounded-md bg-black-500 hover:bg-black-400 text-xs p-1"
      placeholder="Enter a message..."
    ></textarea>
    <div class="absolute flex bottom-0 right-0 py-2 px-1 items-center">
      <p-btn variant="none" size="xs" class="text-gray-200 mr-1">
        <p-icon icon="far fa-smile" size="sm" />
      </p-btn>
      <p-btn variant="none" size="xs" class="text-gray-200 text-xs font-bold h-4 mr-1 rounded">GIF</p-btn>
      <p-btn
        @click="sendMessage"
        variant="primary"
        size="xs"
        :disabled="text.length > 280"
        class="text-xs px-2"
      >Send</p-btn>
    </div>
    <p-modal v-model="showLogin">
      <div class="flex mb-4">
        <button
          @click="isLogin = false"
          class="w-6/12 p-2 select-none"
          :class="!isLogin ? 'border-b-2 border-primary text-primary font-bold' : ''"
        >Sign Up</button>
        <button
          @click="isLogin = true"
          class="w-6/12 select-none"
          :class="isLogin ? 'border-b-2 border-primary text-primary font-bold' : ''"
        >Log In</button>
      </div>
      <LoginForm v-if="isLogin" @login="showLogin = false" />
      <SignupForm v-else @signup="showLogin = false" />
    </p-modal>
  </div>
</template>

<script>
import LoginForm from "@/components/user/LoginForm"
import SignupForm from "@/components/user/SignupForm"

export default {
  components: {
    LoginForm,
    SignupForm
  },

  data: () => ({
    text: "",
    errors: {
      text: ""
    },
    isLogin: false,
    showLogin: false
  }),

  computed: {
    isLoggedIn() {
      return !!this.$store.state.user.username
    }
  },

  watch: {
    text() {
      this.checkMessage()
    },

    // If user login state changes, authenticate user
    "$store.state.user.token": {
      handler(token) {
        if (token) {
          this.$socket.API.emit("chat-auth", {
            id: this.$route.params.playspace,
            token
          })
        } else {
          // TODO: de-auth user
        }
      },
      immediate: true
    }
  },

  sockets: {
    API: {
      reconnect() {
        this.$socket.API.emit("chat-auth", {
          id: this.$route.params.playspace,
          token: this.$store.state.user.token
        })
      }
    }
  },

  methods: {
    sendMessage() {
      if (!this.isLoggedIn) {
        this.showLogin = true
        return
      }

      if (!this.checkMessage()) {
        return
      }

      this.$socket.API.emit("chat-message", this.text)
      this.text = ""
    },

    checkMessage() {
      const { text } = this

      if (!text.length) {
        this.errors.text = ""
        return false
      }
      if (text.length > 280) {
        this.errors.text = "Your message must be less that 280 characters."
        return false
      }

      this.errors.text = ""
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
textarea {
  transition-duration: 100ms;
}
</style>
