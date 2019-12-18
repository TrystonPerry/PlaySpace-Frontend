<template>
  <div
    class="app-sidebar bg-dark-4 text-gray-300 h-full w-12 min-w-12 flex-shrink-0 md:max-w-64 md:min-w-64 shadow-reg"
  >
    <ul class="flex flex-col list-style-none h-full">
      <NavLink to="/live" class="w-full">
        <i class="fas fa-globe"></i>
        <span class="hidden md:block ml-2">Live</span>
      </NavLink>
      <NavLink to="/categories" class="w-full">
        <i class="fas fa-book"></i>
        <span class="hidden md:block ml-2">Browse</span>
      </NavLink>
      <NavLink to="/" class="w-full">
        <i class="fab fa-amilia"></i>
        <span class="hidden md:block ml-2">About</span>
      </NavLink>
      <NavDivider v-if="$store.state.user.username" class="hidden md:flex">
        <h2>Your PlaySpaces</h2>
      </NavDivider>
      <li v-if="$store.state.user.username" class="flex-grow overflow-y-auto scrollbar">
        <ul v-if="!isLoading" class="list-style-none px-1">
          <PlaySpaceNavLink
            v-for="playSpace in playSpaces"
            :key="playSpace.username"
            :playSpace="playSpace"
            class="mb-2"
          />
        </ul>
        <p-loading v-else />
      </li>
    </ul>
  </div>
</template>

<script>
import API from "@/api/api"

import NavLink from "./NavLink"
import PlaySpaceNavLink from "./PlaySpaceNavLink"
import NavDivider from "./NavDivider"

export default {
  components: {
    NavLink,
    PlaySpaceNavLink,
    NavDivider
  },

  data: () => ({
    playSpaces: [],
    isLoading: true
  }),

  watch: {
    "$store.state.user.username": {
      async handler(value) {
        if (value) {
          this.isLoading = true

          const { data, success } = await API.getUsersPlaySpaces()

          if (!success) {
            return
          }

          this.playSpaces = data
        }
        this.isLoading = false
      },
      immediate: true
    }
  }
}
</script>
