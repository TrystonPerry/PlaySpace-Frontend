<template>
  <div>
    <h1 class="text-2xl font-bold text-center">
      Edit Users
    </h1>
    <h3 class="mb-5">
      Add or remove users who are able to add streams and participate in voice
      chat.
    </h3>
    <div class="mb-6">
      <h2 class="text-lg font-bold underline">Streamers</h2>
      <ul class="list-style-none">
        <li v-for="user in users" :key="user.username" class="flex">
          <h4 class="font-bold inline-block">{{ user.username }}</h4>
          <!-- <span>: {{ user.rank }}</span> -->
          <div class="flex-grow"></div>
          <p-tooltip
            v-if="user.username !== $store.state.user.username"
            text="Revoke Streaming Access"
            position="left"
          >
            <p-btn
              @click="revokeUser(user.username)"
              variant="none"
              size="sm"
              class="bg-red-500"
            >
              <p-icon icon="fas fa-trash" size="sm" />
            </p-btn>
          </p-tooltip>
        </li>
      </ul>
    </div>
    <div>
      <h2 class="text-lg font-bold">Add a User</h2>
      <form @submit.prevent="onAddUser" class="flex">
        <p-input v-model="username" placeholder="Username" class="flex-grow" />
        <p-btn type="submit" variant="primary" class="flex-shrink-0" size="sm">
          <p-icon icon="fas fa-plus" />
          Add User
        </p-btn>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex"

import API from "@/api/api"

export default {
  data: () => ({
    username: ""
  }),

  computed: {
    ...mapState({
      playSpace: state => state.playSpace.current
    }),

    ...mapGetters({
      users: "playSpace/users"
    })
  },

  methods: {
    async onAddUser() {
      if (!this.username) return

      const { username } = this
      this.username = ""

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
        text: `${username} can now stream to "${this.playSpace.channelName}"!`
      })
    },

    async revokeUser(username) {
      if (!username) return

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
        text: `${username} can no longer stream to ${this.playSpace.channelName}`
      })
    }
  }
}
</script>

<style></style>
