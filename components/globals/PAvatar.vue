<template>
  <div class="inline-block">
    <img
      :src="$attrs.img || 'https://i.imgur.com/cvrQlUP.png'"
      v-bind="$attrs"
      class="rounded-full inline-block"
      :class="`w-${computedSize} h-${computedSize}`"
    />
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: "md",
      validator: function(value) {
        return ["xs", "sm", "md", "lg"].indexOf(value) > -1
      }
    }
  },

  computed: {
    computedSize() {
      switch (this.size) {
        case "xs":
          return "4"
        case "sm":
          return "8"
        case "md":
          return "12"
        case "lg":
          return "24"
      }
    }
  }
}
</script>

<style>
</style>