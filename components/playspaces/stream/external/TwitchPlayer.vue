<template>
  <iframe
    :src="`https://player.twitch.tv/?channel=${stream.queue[0]}&enableExtensions=false`"
    :id="stream.id"
    frameborder="0"
    allowfullscreen="1"
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