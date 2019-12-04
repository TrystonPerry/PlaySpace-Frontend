<template>
  <li>
    <nuxt-link
      v-bind="$attrs"
      v-on="$listeners"
      class="nav-link flex items-center justify-center md:justify-start hover:bg-black-500 h-12 py-1 px-2"
    >
      <slot></slot>
    </nuxt-link>
  </li>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.nav-link {
  transition-duration: 50ms;
}
</style>