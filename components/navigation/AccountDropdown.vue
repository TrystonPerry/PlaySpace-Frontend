<template>
  <p-dropdown btn-classes="px-3 font-bold h-12">
    <p-avatar :src="$store.state.user.avatar" size="sm" />
    <span class="ml-1">
      {{ $store.state.user.fullUsername }}
    </span>
    <ul
      slot="content"
      class="absolute right-0 list-style-none bg-dark-5 mb-0 text-right w-48"
    >
      <AccountDropdownItem to="/spaces">
        My PlaySpaces
      </AccountDropdownItem>
      <AccountDropdownItem to="/create">
        Create a PlaySpace
      </AccountDropdownItem>
      <AccountDropdownItem
        type="button"
        @click.prevent="$store.dispatch('user/logout')"
      >
        Log Out
      </AccountDropdownItem>
    </ul>
  </p-dropdown>
</template>

<script>
import AccountDropdownItem from "@/components/navigation/AccountDropdownItem"

export default {
  components: {
    AccountDropdownItem
  },

  props: {
    top: true
  },

  watch: {
    "$route.fullPath"() {
      this.showSidebar = false
    }
  }
}
</script>

<style lang="scss" scoped>
a:hover {
  text-decoration: underline;
}
</style>
