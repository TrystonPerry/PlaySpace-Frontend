<template>
  <nuxt-link
    v-bind="$attrs"
    class="p-link inline-block rounded font-bold"
    :class="`btn-${variant} ${computedSize}`"
  >
    <slot></slot>
  </nuxt-link>
</template>

<script>
const variants = [
  "none",
  "primary",
  "primary-hover",
  "white",
  "white-outline",
  "dark",
  "primary-dashed"
]
const sizes = ["xs", "sm", "md", "lg"]

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
