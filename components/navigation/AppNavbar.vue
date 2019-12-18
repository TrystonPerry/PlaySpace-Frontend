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
        <li v-if="isOwner">
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
      <ul v-else class="list-style-none flex">
        <!-- TODO: DONT SHOW IF USER HAS HIT MAX PLAYSPACES -->
        <li v-if="!$route.params.playspace" class="px-1 py-2">
          <p-tooltip text="Create a PlaySpace">
            <p-link to="/create" variant="primary" size="sm">Create</p-link>
          </p-tooltip>
        </li>
        <li v-else class="px-1 py-2">
          <p-btn @click="isShow = true" variant="primary" size="sm">
            <p-icon icon="fas fa-user-plus" />Share
          </p-btn>
        </li>
        <li>
          <AccountDropdown />
        </li>
      </ul>
    </div>
    <p-modal v-model="isEdit">
      <EditPlaySpace @edit="onEdit" />
    </p-modal>
    <p-modal v-model="isShow">
      <h1 class="text-2xl font-bold text-center mb-3">Share on Social</h1>
      <ul class="socials list-style-none flex justify-center">
        <li>
          <a
            href="https://twitter.com/share?ref_src=twsrc%5Etfw"
            class="twitter-share-button w-16 h-8"
            data-size="large"
            data-text="Come hang with me on PlaySpace!"
            data-via="PlaySpaceTV"
            data-show-count="false"
          >Tweet</a>
          <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
        </li>
        <li>
          <p-btn variant="primary" size="sm">
            <p-icon icon="fas fa-link" />Copy link
          </p-btn>
        </li>
      </ul>
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
    isEdit: false,
    isShow: true
  }),

  computed: {
    ...mapGetters({
      isLoggedIn: "user/isLoggedIn"
    }),

    playSpace() {
      return this.$store.state.playSpace.current
    },

    isOwner() {
      if (!this.playSpace.users) return false
      const rank = this.playSpace.users[this.$store.state.user.username]
      return !!rank && rank === "owner"
    }
  },

  methods: {
    ...mapActions({
      toggleLeftSidebar: "nav/toggleLeftSidebar"
    }),

    onEdit() {
      this.isEdit = false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-navbar {
  z-index: 1000;
}
.socials li {
  margin-right: 0.5rem;

  .p-btn {
    height: 28px;
    font-size: 0.75rem;
  }
}
</style>
