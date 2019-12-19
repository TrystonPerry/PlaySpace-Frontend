<template>
  <div class="relative">
    <div
      class="app-navbar flex fixed top-0 justify-between w-full h-12 bg-dark-4 text-gray-300 shadow-md"
    >
      <ul class="list-none flex items-center">
        <button @click="showSidebar = true" class="w-12 h-12">
          <p-icon icon="fas fa-bars" screen-reader-text="Menu" size="lg" />
        </button>
        <NavLink to="/live" class="font-bold">
          <img
            src="/img/playspace-icon-trans.png"
            alt="PlaySpace logo"
            class="h-full"
          />
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
        v-if="!$store.state.user.username"
        class="list-none flex items-center"
      >
        <li class="hidden sm:block px-1 py-2">
          <p-link to="/login" variant="primary-hover" size="sm">Log In</p-link>
        </li>
        <li class="px-1 py-2">
          <p-link to="/signup" variant="primary" size="sm">Sign Up</p-link>
        </li>
      </ul>
      <ul v-else class="list-style-none flex">
        <li class="px-1 py-2">
          <p-tooltip text="Create a PlaySpace">
            <p-link to="/create" variant="primary" size="sm">
              <p-icon icon="fas fa-plus" />
              Create
            </p-link>
          </p-tooltip>
        </li>
        <li>
          <AccountDropdown />
        </li>
      </ul>
    </div>
    <LandingSidebar v-if="showSidebar" @close="showSidebar = false" />
  </div>
</template>

<script>
import LandingSidebar from "./LandingSidebar"
import NavLink from "./NavLink"
import AccountDropdown from "./AccountDropdown"

export default {
  components: {
    LandingSidebar,
    NavLink,
    AccountDropdown
  },

  data: () => ({
    showSidebar: false
  }),

  methods: {
    close() {
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
