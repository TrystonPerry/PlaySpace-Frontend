<template>
  <div class="inline-block">
    <img
      :src="computedAvatar"
      v-bind="$attrs"
      class="rounded-full inline-block"
      :class="`w-${computedSize} h-${computedSize}`"
    />
  </div>
</template>

<script>
export default {
  props: {
    avatar: String,
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
          return "6"
        case "md":
          return "10"
        case "lg":
          return "24"
      }
    },

    computedAvatar() {
      return this.avatar || "https://i.imgur.com/cvrQlUP.png"
    }
  }
}
</script>

<style></style>
