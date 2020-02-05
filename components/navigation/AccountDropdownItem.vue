<template>
  <li>
    <nuxt-link
      v-bind="$attrs"
      v-on="$listeners"
      class="account-dropdown-item flex items-center justify-end hover:bg-black-500 h-10 py-1 px-2"
    >
      <slot></slot>
    </nuxt-link>
  </li>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.account-dropdown-item {
  transition-duration: 50ms;
}
</style>