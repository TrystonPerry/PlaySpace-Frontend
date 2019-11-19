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
      <ul class="list-none flex items-center">
        <li class="hidden sm:block px-1 py-2">
          <p-link to="/login" variant="primary-hover" size="sm">Log In</p-link>
        </li>
        <li class="px-1 py-2">
          <p-link to="/signup" variant="primary" size="sm">Sign Up</p-link>
        </li>
      </ul>
    </div>
    <AppSidebar v-if="showSidebar" @close="showSidebar = false" />
  </div>
</template>

<script>
import AppSidebar from "./AppSidebar"
import NavLink from "./NavLink"

export default {
  components: {
    AppSidebar,
    NavLink
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