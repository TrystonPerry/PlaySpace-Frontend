<template>
  <div :key="$route.params.playspace">
    <PlaySpace v-if="playSpace" :playSpace="playSpace" />
  </div>
</template>

<script>
import API from "@/api/api"

import PlaySpace from "@/components/playspaces/PlaySpace"

export default {
  layout: "app",

  components: {
    PlaySpace
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
