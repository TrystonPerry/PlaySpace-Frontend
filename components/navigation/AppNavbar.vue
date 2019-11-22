<template>
  <div>
    <div
      class="app-navbar flex fixed top-0 justify-between w-full h-12 bg-dark-4 text-gray-300 shadow-md"
    >
      <ul class="list-none flex items-center">
        <button @click="toggleLeftSidebar" class="w-12 h-12">
          <p-icon icon="fas fa-bars" screen-reader-text="Menu" size="lg" />
        </button>
        <NavLink to="/live" class="font-bold">
          <img src="/img/playspace-icon-trans.png" alt="PlaySpace logo" class="h-full" />
          <span>PlaySpace</span>
        </NavLink>
        <NavLink to="/categories" class="hidden sm:block">
          <span>Browse</span>
        </NavLink>
        <NavLink to="/" class="hidden sm:block">
          <span>About</span>
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
            :alt="`${playSpace.username} - PlaySpace`"
            class="w-12 h-12 rounded-full p-1"
          />
        </li>
        <li class="hidden md:block lg:mr-2 font-medium text-lg">{{ playSpace.username }}</li>
        <li class="hidden lg:block">{{ playSpace.title }}</li>
      </ul>
      <ul class="list-none flex items-center">
        <li class="hidden sm:block px-1 py-2">
          <p-link to="/login" variant="primary-hover" size="sm">Log In</p-link>
        </li>
        <li class="px-1 py-2">
          <p-link to="/signup" variant="primary" size="sm">Sign Up</p-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex"
import API from "@/api/server-api"

import NavLink from "./NavLink"

export default {
  data: () => ({
    playSpace: {}
  }),

  async mounted() {
    this.playSpace = await API.getPlaySpace(this.$route.params.playspace)
  },

  components: {
    NavLink
  },

  watch: {
    async "$route.params.playspace"(value) {
      this.playSpace = await API.getPlaySpace(value)
    }
  },

  methods: {
    ...mapActions({
      toggleLeftSidebar: "nav/toggleLeftSidebar"
    })
  }
}
</script>

<style lang="scss" scoped>
.app-navbar {
  z-index: 1018;
}
</style>