<template>
  <iframe
    :src="`https://player.twitch.tv/?channel=${stream.queue[0]}&enableExtensions=false`"
    frameborder="0"
    class="w-full h-full"
  ></iframe>
</template>

<script>
export default {
  props: {
    stream: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>
</style>