<template>
  <div v-click-out="close" :id="id" class="p-dropdown">
    <button @click="isVisible = !isVisible" :class="btnClasses">
      <slot></slot>
    </button>
    <slot v-if="isVisible" name="content"></slot>
  </div>
</template>

<script>
export default {
  props: {
    btnClasses: String
  },

  data: () => ({
    isVisible: false
  }),

  // beforeDestroy() {
  //   window.removeEventListener("click", this.onClick)
  // },

  computed: {
    id() {
      return Math.random()
        .toString(36)
        .substr(2, 9)
    }
  },

  methods: {
    close() {
      this.isVisible = false
    }
  }

  // methods: {
  //   onClick(e) {
  //     if (e.target.parentNode.id !== this.id) {
  //       this.isVisible = false
  //     }
  //   }
  // },

  // watch: {
  //   isVisible: {
  //     handler() {
  //       if (this.isVisible) {
  //         window.addEventListener("click", this.onClick)
  //       } else {
  //         window.removeEventListener("click", this.onClick)
  //       }
  //     }
  //   }
  // }
}
</script>

<style>
</style>
