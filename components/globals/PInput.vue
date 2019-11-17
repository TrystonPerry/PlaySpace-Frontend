<template>
  <label class="block text-lg">
    <span v-if="label" :class="{ 'visually-hidden': screenReaderOnly }">
      {{ label }}
    </span>
    <span aria-hidden></span>
    <input
      v-if="['text', 'email', 'password'].indexOf(type) > -1"
      :type="type"
      v-bind="$attrs"
      v-on="$listeners"
      class="rounded text-xl border border-gray-400 h-10 py-2 px-3 w-full"
    />
  </label>
</template>

<script>
const types = ["text", "email", "password"]

export default {
  props: {
    type: {
      type: String,
      default: "text",
      validator: function(value) {
        return types.indexOf(value) > -1
      }
    },
    label: String,
    screenReaderOnly: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>
</style>