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
      </ul>
      <ul
        v-if="$route.params.playspace"
        class="absolute hidden sm:flex list-style-none items-center"
        style="left:50%;transform:translateX(-50%)"
      >
        <li class="md:mr-2">
          <p-avatar :avatar="playSpace.avatar" class="w-12 h-12 rounded-full p-1" />
        </li>
        <li class="hidden md:block lg:mr-2 font-medium text-lg">
          <p-tooltip :text="`/p/${playSpace.id}`">{{ playSpace.channelName }}</p-tooltip>
        </li>
        <li class="hidden lg:block">
          <p-tooltip :text="playSpace.title">{{ playSpace.title | truncate(32) }}</p-tooltip>
        </li>
        <li>
          <p-tooltip text="Edit PlaySpace">
            <p-btn @click="isEdit = !isEdit" variant="none" size="sm" class="mx-1">
              <i class="fas fa-cog"></i>
            </p-btn>
          </p-tooltip>
        </li>
      </ul>
      <ul v-if="!$store.state.user.username" class="list-none flex items-center">
        <li class="hidden sm:block px-1 py-2">
          <p-link to="/login" variant="primary-hover" size="sm">Log In</p-link>
        </li>
        <li class="px-1 py-2">
          <p-link to="/signup" variant="primary" size="sm">Sign Up</p-link>
        </li>
      </ul>
      <AccountDropdown v-else />
    </div>
    <p-modal v-model="isEdit" class="text-gray-200">
      <EditPlaySpace @edit="isEdit = false" />
    </p-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import API from "@/api/api"

import NavLink from "./NavLink"
import AccountDropdown from "./AccountDropdown"
import EditPlaySpace from "@/components/playspaces/EditPlaySpace"

export default {
  components: {
    NavLink,
    AccountDropdown,
    EditPlaySpace
  },

  data: () => ({
    playSpace: {},
    isEdit: false
  }),

  computed: {
    ...mapGetters({
      isLoggedIn: "user/isLoggedIn"
    })
  },

  watch: {
    "$route.params.playspace": {
      async handler(value) {
        if (!value) return

        const { data, success } = await API.getPlaySpace(value)

        if (!success) {
          return
        }

        this.playSpace = data
      },
      immediate: true
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
