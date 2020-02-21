<template>
  <li
    class="relative flex flex-column px-1"
    :class="{ 'opacity-25': message.isBanned }"
  >
    <p-avatar :avatar="message.avatar" size="xs" class="flex-shrink-0" />
    <div class="w-full ml-1 max-h-64 overflow-hidden rounded-md">
      <button @click="toggleControls" class="m-0 p-0">
        <h3 class="text-sm font-bold">{{ message.username }}</h3>
      </button>
      <p
        v-if="type === 'text'"
        class="text-xs break-words"
        v-html="computedMessage"
      ></p>
      <img
        v-else-if="type === 'img'"
        :src="computedMessage"
        class="w-full rounded-md"
      />
      <p v-else-if="type === 'banned'" class="text-xs break-words italic">
        Message removed
      </p>
    </div>
    <div
      v-if="isControls"
      v-click-out="toggleControls"
      class="absolute bg-black-300 shadow rounded p-2"
      style="z-index:110"
    >
      <div class="flex items-center">
        <p-avatar :avatar="message.avatar" size="sm" />
        <h1 class="flex-grow font-bold ml-1">
          {{ message.username }}
        </h1>
        <p-btn @click="toggleControls" variant="none" size="xs">
          <p-icon icon="fas fa-times" />
        </p-btn>
      </div>
      <div v-if="canEditUser" class="flex mt-3">
        <p-btn
          v-if="!isStreamer"
          @click="onAddUser"
          variant="none"
          size="sm"
          class="block flex-grow text-sm"
        >
          <p-icon icon="fas fa-user-plus" />
          <div class="text-xs">
            Make Streamer
          </div>
        </p-btn>
        <p-btn
          v-else
          @click="revokeUser"
          variant="none"
          size="sm"
          class="block flex-grow text-sm"
        >
          <p-icon icon="fas fa-user-plus" />
          <div class="text-xs">
            Remove Streamer
          </div>
        </p-btn>
        <p-btn
          @click="banUser(900)"
          variant="none"
          size="sm"
          class="block flex-grow text-sm"
        >
          <p-icon icon="fas fa-clock" />
          <div class="text-xs">
            Timeout
          </div>
        </p-btn>
        <p-btn
          @click="banUser"
          variant="none"
          size="sm"
          class="block flex-grow text-sm"
        >
          <p-icon icon="fas fa-ban" />
          <div class="text-xs">
            Ban
          </div>
        </p-btn>
      </div>
    </div>
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
    },

    canEditUser() {
      return (
        this.isAuthorized &&
        this.message.username.toLowerCase() !== this.$store.state.user.username
      )
    },

    isStreamer() {
      return this.$store.state.playSpace.current.users[
        this.message.username.toLowerCase()
      ]
    }
  },

  methods: {
    toggleControls() {
      this.isControls = !this.isControls
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
    },

    async onAddUser() {
      const { username } = this.message

      const { success, error } = await API.updateUser(
        this.$route.params.playspace,
        {
          username,
          rank: "streamer"
        }
      )

      if (!success) {
        return
      }

      this.$notify({
        type: "success",
        title: "Added user to PlaySpace",
        text: `${username} can now stream to "${this.$store.state.playSpace.current.channelName}"!`
      })
    },

    async revokeUser() {
      const { username } = this.message

      const { success } = await API.updateUser(this.$route.params.playspace, {
        username,
        rank: "none"
      })

      if (!success) {
        return
      }

      this.$notify({
        type: "success",
        title: "Removed user from PlaySpace",
        text: `${username} can no longer stream to ${this.$store.state.playSpace.current.channelName}`
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