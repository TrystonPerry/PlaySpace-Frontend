<template>
  <popper trigger="hover" :options="{ placement: position }">
    <small class="bg-dark-1 text-gray-200 rounded shadow-reg py-1 px-2 text-center">{{ text }}</small>
    <div slot="reference">
      <slot></slot>
    </div>
  </popper>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ""
    },
    position: {
      type: String,
      default: "bottom"
    }
  },
  
}
</script>