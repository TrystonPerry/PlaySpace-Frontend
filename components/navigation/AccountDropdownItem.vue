<template>
  <li>
    <nuxt-link
      v-if="type === 'link'"
      v-bind="$attrs"
      v-on="$listeners"
      class="account-dropdown-item flex items-center justify-end hover:bg-black-500 h-10 py-1 px-2 w-full"
    >
      <slot></slot>
    </nuxt-link>
    <button
      v-if="type === 'button'"
      v-bind="$attrs"
      v-on="$listeners"
      class="account-dropdown-item flex items-center justify-end hover:bg-black-500 h-10 py-1 px-2 w-full"
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
.account-dropdown-item {
  transition-duration: 50ms;
}
</style>