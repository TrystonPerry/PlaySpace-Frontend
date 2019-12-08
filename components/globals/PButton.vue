<template>
  <button
    v-bind="$attrs"
    v-on="$listeners"
    class="p-btn inline-block rounded font-medium"
    :class="`btn-${variant} ${computedSize}`"
  >
    <slot></slot>
  </button>
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
        case "xs":
          return "px-1"
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
