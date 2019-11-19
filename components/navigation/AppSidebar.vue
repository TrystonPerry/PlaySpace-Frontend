<template>
  <div
    class="app-sidebar fixed top-0 bg-dark-5 text-gray-300 h-screen w-full max-w-64 shadow-reg"
  >
    <ul
      v-click-out="close"
      class="flex flex-col list-style-none h-full"
      :style="`height: ${screenHeight}`"
    >
      <li>
        <button @click="close" class="w-12 h-12">
          <p-icon icon="fas fa-bars" screen-reader-text="Menu" size="lg" />
        </button>
      </li>
      <NavLink @click="close" to="/live">
        <span>Live</span>
      </NavLink>
      <NavLink @click="close" to="/categories">
        <span>Browse</span>
      </NavLink>
      <NavLink @click="close" to="/">
        <span>About</span>
      </NavLink>
      <div class="flex-grow"></div>
      <ul class="list-none flex text-center px-1">
        <li class="px-1 py-2 w-6/12">
          <p-link to="/signup" variant="primary" size="sm" class="w-full">
            Sign Up
          </p-link>
        </li>
        <li class="px-1 py-2 w-6/12">
          <p-link to="/login" variant="primary-hover" size="sm" class="w-full">
            Log In
          </p-link>
        </li>
      </ul>
    </ul>
    <!-- <div
      class="app-sidebar-bg fixed top-0 left-0 h-screen w-screen"
      style="background:rgba(0,0,0,0.2)"
    ></div> -->
  </div>
</template>

<script>
import NavLink from "./NavLink"

export default {
  components: {
    NavLink
  },

  data: () => ({
    screenHeight: "0px"
  }),

  mounted() {
    this.updateScreenHeight()
    window.addEventListener("resize", this.updateScreenHeight)
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.updateScreenHeight)
  },

  methods: {
    close() {
      this.$emit("close")
    },

    updateScreenHeight() {
      this.screenHeight = window.innerHeight + "px"
    }
  }
}
</script>

<style lang="scss" scoped>
.app-sidebar {
  z-index: 1020;
}
.app-sidebar-bg {
  z-index: 1019;
}
</style>