<template>
  <li
    @mouseenter="showControls"
    @mouseleave="hideControls"
    class="relative flex flex-column hover:bg-black-300 px-1"
    :class="{ 'opacity-25': message.isBanned }"
  >
    <p-avatar :avatar="message.avatar" size="xs" class="flex-shrink-0" />
    <div class="w-full ml-1 max-h-64 overflow-hidden rounded-md">
      <h3 class="text-sm font-bold">{{ message.username }}</h3>
      <p v-if="type === 'text'" class="text-xs break-words" v-html="computedMessage"></p>
      <img v-else-if="type === 'img'" :src="computedMessage" class="w-full rounded-md" />
      <p v-else-if="type === 'banned'" class="text-xs break-words italic">Message removed</p>
    </div>
    <small
      v-if="isControls"
      class="absolute flex text-gray-200 py-1 px-2 text-center"
      style="top:50%;left:50%;transform:translate(-50%,-50%)"
    >
      <p-btn @click="banUser(900)" variant="none" size="xs" class="bg-orange-500 text-xs mr-1">
        <p-icon icon="fas fa-trash p-1" />
      </p-btn>
      <p-btn @click="banUser(-1)" variant="none" size="xs" class="bg-red-500 text-xs">
        <p-icon icon="fas fa-trash p-1" />
      </p-btn>
    </small>
  </li>
</template>

<script>
import { mapGetters } from "vuex"

import API from "@/api/api"

const urlRegex = /(https?:\/\/)?(\w+(\.\w{2,})+(\/\S+)?)/g
const imgUrlRegex = /^(https:\/\/)(\S+\.\S{2,}\.(png|jpg|jpeg|gif|webp|svg))((\/|\?)\S+)?$/

export default {
  data: () => ({
    type: "text",
    isControls: false
  }),

  props: {
    message: {
      type: Object
    }
  },

  computed: {
    ...mapGetters({
      isAuthorized: "playSpace/isAuthorized"
    }),

    computedMessage() {
      if (this.message.isBanned) {
        this.type = "banned"
        return
      }
      const { text } = this.message
      if (imgUrlRegex.test(text)) {
        this.type = "img"
        return text
      }
      let match
      let out = text
      while ((match = urlRegex.exec(text))) {
        const [full, protocol = "http://", url] = match
        const href = protocol + url
        out = out.replace(
          full,
          `<a href="${href}" class="text-primary underline" target="_blank">${url}</a>`
        )
      }
      return out
    }
  },

  methods: {
    showControls() {
      if (!this.isAuthorized) return
      if (
        this.message.username.toLowerCase() === this.$store.state.user.username
      )
        return
      this.isControls = true
    },

    hideControls() {
      if (!this.isAuthorized) return
      if (
        this.message.username.toLowerCase() === this.$store.state.user.username
      )
        return
      this.isControls = false
    },

    async banUser(time) {
      const { success, data, error } = await API.banUser(
        this.$route.params.playspace,
        {
          username: this.message.username,
          timeoutLength: time,
          // TODO, remove this useless info
          id: this.$route.params.playspace
        }
      )

      if (!success) {
        this.$notify({
          type: "error",
          title: "Error banning user",
          text: error || "User was not banned from your PlaySpace"
        })
        return
      }

      const text = time > -1 ? `banned for ${time} seconds` : "perma-banned"

      this.$socket.API.emit("chat-ban", this.message.username)

      this.$notify({
        type: "success",
        title: `Ban successful`,
        text: `User ${text}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
li {
  transition-duration: 100ms;
}
</style>