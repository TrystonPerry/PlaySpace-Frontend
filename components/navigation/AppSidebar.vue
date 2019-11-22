<template>
  <div
    class="app-sidebar bg-dark-4 text-gray-300 h-full w-full max-w-64 min-w-64 shadow-reg"
  >
    <ul class="flex flex-col list-style-none h-full">
      <NavLink to="/live">
        <span>Live</span>
      </NavLink>
      <NavLink to="/categories">
        <span>Browse</span>
      </NavLink>
      <NavLink to="/">
        <span>About</span>
      </NavLink>
      <NavDivider>
        <h2>
          Your PlaySpaces
        </h2>
      </NavDivider>
      <li class="flex-grow overflow-y-auto scrollbar">
        <ul class="list-style-none px-1">
          <PlaySpaceNavLink
            v-for="playSpace in playSpaces"
            :key="playSpace.username"
            :playSpace="playSpace"
            class="mb-2"
          />
        </ul>
      </li>
      <li>
        <ul class="list-none flex text-center px-1">
          <li class="px-1 py-2 w-6/12">
            <p-link to="/signup" variant="primary" size="sm" class="w-full">
              Sign Up
            </p-link>
          </li>
          <li class="px-1 py-2 w-6/12">
            <p-link
              to="/login"
              variant="primary-hover"
              size="sm"
              class="w-full"
            >
              Log In
            </p-link>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import API from "@/api/server-api"

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
    playSpaces: []
  }),

  async created() {
    let playSpaces = await API.getPlaySpaces()

    this.playSpaces = playSpaces
  }
}
</script>
