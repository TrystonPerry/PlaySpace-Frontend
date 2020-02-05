<template>
  <div
    class="app-sidebar fixed top-0 text-gray-300 w-screen h-screen p-4 sm:p-0 shadow-reg"
  >
    <ul
      v-click-out="close"
      class="flex flex-col bg-dark-5 rounded sm:rounded-none relative sm:max-w-64 "
      :style="`height: ${screenHeight}`"
    >
      <li>
        <ul>
          <li class="absolute right-0">
            <button @click="close" class="sm:hidden w-12 h-12">
              <p-icon
                icon="fas fa-times"
                screen-reader-text="Close menu"
                size="lg"
              />
            </button>
          </li>
          <li class="sm:flex">
            <button @click="close" class="hidden sm:block w-12 h-12">
              <p-icon
                icon="fas fa-bars"
                screen-reader-text="Close menu"
                size="lg"
              />
            </button>
            <NavLink to="/" class="font-bold">
              <img
                src="/img/playspace-icon-trans.png"
                alt="PlaySpace logo"
                class="h-full"
              />
              <span>PlaySpace</span>
            </NavLink>
          </li>
        </ul>
      </li>
      <NavLink to="/live">
        <span>Live</span>
      </NavLink>
      <!-- <NavLink v-if="isLoggedIn" to="/spaces">
        <span>My PlaySpaces</span>
      </NavLink>
      <NavLink v-if="isLoggedIn" :to="`/u/${$store.state.user.username}`">
        <span>My Profile</span>
      </NavLink>
      <NavLink v-if="isLoggedIn" to="/account">
        <span>My Account</span> -->
      </NavLink>
      <li>
        <ul class="bg-black-400 rounded m-2">
          <NavLink v-if="!isLoggedIn" to="/login" class="sm:hidden">
            <span>Log In</span>
          </NavLink>
          <NavLink v-if="!isLoggedIn" to="/signup" class="sm:hidden">
            <span>Sign Up</span>
          </NavLink>
          <li class="w-full text-center">
            <p-link to="/create" variant="primary" size="md" class="w-full">
              Create a PlaySpace
            </p-link>
          </li>
        </ul>
      </li>
      <div class="flex-grow"></div>
      <ul
        class="hidden sm:flex justify-center social-media list-style-none pl-0 text-gray-400 py-2 text-center"
        aria-label="PlaySpace's Social Media"
      >
        <li class="mr-2">
          <a
            href="https://twitter.com/playspacetv"
            target="_blank"
            class="text-gray-300"
          >
            <p-icon
              icon="fab fa-twitter"
              screen-reader-text="PlaySpace Twitter"
            />
          </a>
        </li>
        <li class="mr-2">
          <a
            href="https://discord.gg/WwewP4D"
            target="_blank"
            class="text-gray-300"
          >
            <p-icon
              icon="fab fa-discord"
              screen-reader-text="PlaySpace Discord"
            />
          </a>
        </li>
        <li class="mr-2">
          <a
            href="https://medium.com/@playspacetv"
            target="_blank"
            class="text-gray-300"
          >
            <p-icon
              icon="fab fa-medium"
              screen-reader-text="PlaySpace Medium"
            />
          </a>
        </li>
        <li class="mr-2">
          <a
            href="https://www.youtube.com/channel/UC7Uqb7o-sthQtJLarbBGIcg"
            target="_blank"
            class="text-gray-300"
          >
            <p-icon
              icon="fab fa-youtube"
              screen-reader-text="PlaySpace YouTube"
            />
          </a>
        </li>
        <li class="mr-2">
          <a
            href="https://reddit.com/r/playspacetv"
            target="_blank"
            class="text-gray-300"
          >
            <p-icon
              icon="fab fa-reddit"
              screen-reader-text="PlaySpace Reddit"
            />
          </a>
        </li>
        <li>
          <a
            href="https://instagram.com/playspacetv"
            target="_blank"
            class="text-gray-300"
          >
            <p-icon
              icon="fab fa-instagram"
              screen-reader-text="PlaySpace Instagram"
            />
          </a>
        </li>
      </ul>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

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

  computed: {
    isLoggedIn() {
      return !!this.$store.state.user.username
    }
  },

  methods: {
    close() {
      this.$emit("close")
    },

    updateScreenHeight() {
      // If a mobile 'sm' screen or less, we dont want a full height sidebar
      if (window.innerWidth < 640) {
        this.screenHeight = "auto"
        return
      }
      this.screenHeight = window.innerHeight + "px"
    }
  }
}
</script>

<style lang="scss" scoped>
.app-sidebar {
  z-index: 1020;
  background: rgba(0, 0, 0, 0.25);
}
</style>
