<template>
  <div v-show="value" class="modal flex items-center justify-center">
    <div class="modal__box bg-dark-5 shadow-reg overflow-auto">
      <button @click="$emit('input', false)" class="btn btn-close">X</button>
      <slot></slot>
    </div>
    <div @click="$emit('input', false)" class="modal__bg"></div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },

  mounted() {
    window.addEventListener("keydown", this.onKeyDown)
  },

  beforeDestroy() {
    window.removeEventListener("keydown", this.onKeyDown)
  },

  methods: {
    onKeyDown(e) {
      if (e.keyCode === 27) {
        this.$emit("input", false)
      }
    }
  }
}
</script>

<style lang="scss">
.modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  &__box {
    position: absolute;
    padding: 20px;
    border-radius: 4px;
    width: 100%;
    max-width: 600px;
    max-height: 75vh;
    z-index: 1030;
    margin: 10px;
    box-sizing: border-box;

    .btn-close {
      color: red;
      font-weight: bold;
      color: white;
      background: black;
      height: 24px;
      width: 24px;
      border-radius: 4px;
      position: absolute;
      right: 10px;
      top: 10px;
    }
  }

  &__bg {
    background: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1029;
  }
}
</style>
