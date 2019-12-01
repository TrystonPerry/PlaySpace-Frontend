<template>
  <div class="playspace">
    <div class="visually-hidden">
      <h1>{{ playSpace.username }}</h1>
      <h2>{{ playSpace.title }}</h2>
    </div>
    <VideoContainer class="video-container" />
    <div class="mt-3"></div>
  </div>
</template>

<script>
import API from "@/api/api"

import VideoContainer from "@/components/playspaces/VideoContainer"

export default {
  layout: "app",

  components: {
    VideoContainer
  },

  head() {
    return require("@/meta/p/_playspace")({
      title: `${this.playSpace.channelName} - PlaySpace`,
      desc: this.playSpace.title,
      img: this.playSpace.avatar,
      url: this.$route.path
    })
  },

  async asyncData({ params, error }) {
    const { data, success } = await API.getPlaySpace(params.playspace)

    if (!success) {
      return error({
        statusCode: 404,
        message: "No channel with that username exists"
      })
    }

    return { playSpace: data }
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
