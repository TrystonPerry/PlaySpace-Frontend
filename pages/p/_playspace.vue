<template>
  <div class="playspace h-full" style="max-height:100%">
    <div class="visually-hidden">
      <h1>{{ playSpace.username }}</h1>
      <h2>{{ playSpace.title }}</h2>
    </div>
    <div class="flex flex-col h-full">
      <VideoContainer class="video-container p-2" />
      <PlaySpaceMobileSidebar
        v-if="$store.state.nav.isMobile"
        :key="$route.params.playspace"
        class="flex-grow mt-2"
      />
    </div>
  </div>
</template>

<script>
import API from "@/api/api"

import VideoContainer from "@/components/playspaces/VideoContainer"
import PlaySpaceMobileSidebar from "@/components/navigation/PlaySpaceMobileSidebar"

export default {
  layout: "app",

  components: {
    VideoContainer,
    PlaySpaceMobileSidebar
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
