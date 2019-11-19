<template>
  <div class="playspace">
    <VideoContainer class="video-container" />
  </div>
</template>

<script>
import VideoContainer from "@/components/playspaces/VideoContainer"

export default {
  layout: "app",

  components: {
    VideoContainer
  }
}
</script>

<style lang="scss" scoped>
.playspace {
  .video-container {
    height: calc(100vh - 7rem);
  }
}
</style>