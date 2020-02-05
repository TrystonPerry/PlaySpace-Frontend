<template>
  <li>
    <nuxt-link
      v-if="type === 'link'"
      v-bind="$attrs"
      v-on="$listeners"
      class="nav-link flex items-center justify-center md:justify-start hover:bg-black-500 h-12 py-1 px-2"
    >
      <slot></slot>
    </nuxt-link>
    <button
      v-else-if="type === 'button'"
      v-bind="$attrs"
      v-on="$listeners"
      class="nav-link flex items-center justify-center md:justify-start hover:bg-black-500 h-12 w-full py-1 px-2"
    >
      <slot></slot>
    </button>
  </li>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "link",
      validator(value) {
        return ["link", "button"].includes(value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-link {
  transition-duration: 50ms;
}
</style>