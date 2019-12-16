<template>
  <portal to="modal-container">
    <div v-if="value" class="modal flex items-center justify-center">
      <div class="modal__box-container">
        <div class="modal__box bg-dark-5 shadow-reg scrollbar overflow-auto text-gray-300">
          <button @click="$emit('input', false)" class="btn btn-close">X</button>
          <slot></slot>
        </div>
      </div>
      <div @click="$emit('input', false)" class="modal__bg"></div>
    </div>
  </portal>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },

  computed: {
    id() {
      return Math.random().toString(36).substr(2, 9)
    }
  },

  mounted() {
    window.addEventListener("keydown", this.onKeyDown)
  },

  beforeDestroy() {
    window.removeEventListener("keydown", this.onKeyDown)
  },

  // TODO fix input focus :(((((
  // watch: {
  //   async value(value) {
  //     if (value === true) {
  //       await this.$nextTick()
  //       const modal = document.getElementById(this.id)
  //       console.log(modal, this.id)
  //       const input = modal.querySelector("input")
  //       if (input) {
  //         input.focus()
  //       }
  //     }
  //   }
  // },

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
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1030;

  &__box {
    padding: 20px;
    position: relative;
    border-radius: 4px;
    max-height: 75vh;
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

    &-container {
      position: fixed;
      z-index: 1030;
      padding: 1rem;
      width: 100%;
      max-width: 600px;
      margin: auto;
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
