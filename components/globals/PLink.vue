<template>
  <nuxt-link
    v-bind="$attrs"
    class="p-link inline-block rounded font-medium"
    :class="`${variant} ${computedSize}`"
  >
    <slot></slot>
  </nuxt-link>
</template>

<script>
const variants = ["primary", "primary-outline", "white", "white-outline"]
const sizes = ["sm", "md", "lg"]

export default {
  props: {
    variant: {
      type: String,
      required: true,
      validator: function(value) {
        return variants.indexOf(value) > -1
      }
    },

    size: {
      type: String,
      default: "md",
      validator: function(value) {
        return sizes.indexOf(value) > -1
      }
    }
  },

  computed: {
    computedSize() {
      switch (this.size) {
        case "sm":
          return "py-1 px-2"
        case "md":
          return "py-2 px-3"
        case "lg":
          return "py-3 px-4"
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.p-link {
  @apply border;
  transition-duration: 50ms;

  &:hover {
    transform: translateY(-1px);
  }
}

.primary {
  @apply bg-primary text-white border-primary;
}

.primary-outline {
  @apply text-primary bg-white border-primary;

  &:hover {
    @apply bg-primary text-white;
  }
}

.white {
  @apply bg-white text-primary border-white;
}

.white-outline {
  @apply text-white bg-primary border-white;

  &:hover {
    @apply bg-white text-primary;
  }
}
</style>