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
      </ul>
      <div class="flex-grow"></div>
      <ul v-if="!username" class="flex items-center">
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
    showSidebar: false
  }),

  computed: {
    ...mapState({
      username: state => state.user.username
    }),

    homePath() {
      return this.username ? "/live" : "/"
    },

    playSpace() {
      return this.$store.state.playSpace.current
    },

    isOwner() {
      if (!this.playSpace.users) return false
      const rank = this.playSpace.users[this.username]
      return !!rank && rank === "owner"
    }
  },

  watch: {
    "$route.fullPath"() {
      this.showSidebar = false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-navbar {
  z-index: 1018;
}
</style>
