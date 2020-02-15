<template>
  <div class="relative">
    <div
      class="app-navbar flex fixed top-0 w-full h-12 bg-dark-4 text-gray-300 shadow-md"
    >
      <ul class="list-none flex items-center">
        <button @click="showSidebar = true" class="hidden sm:block w-12 h-12">
          <p-icon icon="fas fa-bars" screen-reader-text="Menu" size="lg" />
        </button>
        <NavLink :to="homePath" class="font-bold">
          <img
            src="/img/playspace-icon-trans.png"
            alt="PlaySpace logo"
            class="h-full"
          />
          <span class="hidden sm:inline">PlaySpace</span>
        </NavLink>
        <NavLink to="/live" class="hidden sm:block">
          <span>Live</span>
        </NavLink>
      </ul>
      <ul
        v-if="$route.params.playspace"
        class="absolute hidden sm:flex list-style-none items-center"
        style="left:50%;transform:translateX(-50%)"
      >
        <li class="md:mr-2">
          <p-avatar
            :avatar="playSpace.avatar"
            class="w-12 h-12 rounded-full p-1"
          />
        </li>
        <li class="hidden md:block lg:mr-2 font-bold text-lg">
          <p-tooltip :text="`/p/${playSpace.id}`">
            {{ playSpace.channelName }}
          </p-tooltip>
        </li>
        <li class="hidden lg:block">
          <p-tooltip :text="playSpace.title">
            {{ playSpace.title | truncate(32) }}
          </p-tooltip>
        </li>
        <li v-if="isOwner">
          <p-tooltip text="Edit PlaySpace">
            <p-btn
              @click="isEdit = !isEdit"
              variant="none"
              size="sm"
              class="mx-1"
            >
              <i class="fas fa-cog"></i>
            </p-btn>
          </p-tooltip>
        </li>
      </ul>
      <div class="flex-grow"></div>
      <ul v-if="!$store.state.user.username" class="flex items-center">
        <li class="hidden sm:block px-1 py-2">
          <p-link to="/login" variant="primary-hover" size="sm">
            Log In
          </p-link>
        </li>
        <li class="hidden sm:block px-1 py-2">
          <p-link to="/signup" variant="primary" size="sm">
            Sign Up
          </p-link>
        </li>
      </ul>
      <ul v-else class="list-style-none flex">
        <li>
          <AccountDropdown />
        </li>
      </ul>
      <div class="sm:hidden">
        <button @click="showSidebar = true" class="w-12 h-12">
          <p-icon icon="fas fa-bars" screen-reader-text="Menu" size="lg" />
        </button>
      </div>
    </div>
    <LandingSidebar v-if="showSidebar" @close="showSidebar = false" />
    <p-modal v-model="isEdit">
      <EditPlaySpace @edit="onEdit" />
    </p-modal>
    <p-modal v-model="isEditRanks">
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
          <p-input
            v-model="username"
            placeholder="Username"
            class="flex-grow"
          />
          <p-btn
            type="submit"
            variant="primary"
            class="flex-shrink-0"
            size="sm"
          >
            <p-icon icon="fas fa-plus" />
            Add User
          </p-btn>
        </form>
      </div>
    </p-modal>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex"

import LandingSidebar from "./LandingSidebar"
import NavLink from "./NavLink"
import AccountDropdown from "./AccountDropdown"
import EditPlaySpace from "@/components/playspaces/EditPlaySpace"

export default {
  components: {
    LandingSidebar,
    NavLink,
    AccountDropdown,
    EditPlaySpace
  },

  data: () => ({
    isEdit: false,
    isEditRanks: false,
    showSidebar: false
  }),

  computed: {
    ...mapState({
      username: state => state.user.username
    }),

    ...mapGetters({
      users: "playSpace/users"
    }),

    homePath() {
      const { username } = this.$store.state.user
      return username ? "/live" : "/"
    },

    playSpace() {
      return this.$store.state.playSpace.current
    },

    isOwner() {
      if (!this.playSpace.users) return false
      const rank = this.playSpace.users[this.$store.state.user.username]
      return !!rank && rank === "owner"
    }
  },

  watch: {
    "$route.fullPath"() {
      this.showSidebar = false
    }
  },

  methods: {
    onEdit() {
      this.isEdit = false
    },

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

<style lang="scss" scoped>
.app-navbar {
  z-index: 1018;
}
</style>
