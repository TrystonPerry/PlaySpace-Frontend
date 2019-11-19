<template>
  <span :title="screenReaderText">
    <i :class="`${icon} text-${size}`" aria-hidden></i>
    <span v-if="screenReaderText" class="visually-hidden">{{
      screenReaderText
    }}</span>
  </span>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true
    },
    screenReaderText: String,
    size: {
      type: String,
      default: "base"
    }
  }
}
</script>

<style>
</style>