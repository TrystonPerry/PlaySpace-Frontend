<template>
  <div class="inline-block">
    <img
      :src="computedAvatar"
      v-bind="$attrs"
      class="inline-block bg-gray-100"
      :class="computedClasses"
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
    },
    noRounded: {
      type: Boolean,
      default: false
    },
    imgClasses: {
      type: String,
      default: ""
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
    },

    computedClasses() {
      return `w-${this.computedSize} h-${this.computedSize} object-cover ${this.imgClasses} ${this.noRounded ? '' : 'rounded-full'}`
    }
  }
}
</script>

<style></style>
