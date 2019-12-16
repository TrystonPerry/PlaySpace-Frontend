<template>
  <p-dropdown btn-classes="px-3 font-medium h-12">
    <p-avatar :src="$store.state.user.avatar" size="sm" />
    <span class="hidden sm:inline-block ml-1">
      {{ $store.state.user.fullUsername }}
    </span>
    <ul
      slot="content"
      class="absolute right-0 list-style-none bg-dark-5 px-2 py-1 shadow-reg mb-0 text-right w-48"
    >
      <!-- <li>
        <nuxt-link :to="`/profile/${$store.state.user.username}`">
          My Profile
        </nuxt-link>
      </li> -->
      <!-- <li>
        <nuxt-link to="/playspaces">
          My PlaySpaces
        </nuxt-link>
      </li> -->
      <!-- <li>
        <nuxt-link to="/account">
          My Account
        </nuxt-link>
      </li> -->
      <li>
        <a href="#" @click.prevent="$store.dispatch('user/logout')">
          Log Out
        </a>
      </li>
    </ul>
  </p-dropdown>
</template>

<script>
export default {
  props: {
    top: true
  }
}
</script>

<style lang="scss" scoped>
a:hover {
  text-decoration: underline;
}
</style>
