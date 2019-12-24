<template>
  <p-btn
    @click="copy"
    :variant="variant"
    :size="size"
  >
    <slot></slot>
  </p-btn>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true
    },
    variant: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: "md"
    }
  },

  methods: {
    copy() {
      const el = document.createElement('textarea');
      el.classList.add("visually-hidden")
      el.value = this.text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      this.$notify({
        type: "success",
        title: "Link copied!",
        text: "Send this link to your friends so they can join!"
      })
    }
  }
}
</script>

<style>

</style>