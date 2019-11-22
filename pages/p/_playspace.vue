<template>
  <div class="playspace">
    <div class="visually-hidden">
      <h1>{{ playSpace.username }}</h1>
      <h2>{{ playSpace.title }}</h2>
    </div>
    <VideoContainer class="video-container" />
  </div>
</template>

<script>
import sAPI from "@/api/server-api"

import VideoContainer from "@/components/playspaces/VideoContainer"

export default {
  layout: "app",

  components: {
    VideoContainer
  },

  head() {
    return require("@/meta/p/_playspace")({
      title: `${this.playSpace.username} - PlaySpace`,
      desc: `Watch ${this.playSpace.username}'s streams on PlaySpace Live. Participate in chat, watch videos, play games together.`,
      img: this.playSpace.avatar,
      url: this.$route.path
    })
  },

  async asyncData({ params, error }) {
    const playSpace = await sAPI.getPlaySpace(params.playspace)

    if (!playSpace.success) {
      error({
        statusCode: 404,
        message: "No channel with that username exists"
      })
    }

    return { playSpace }
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