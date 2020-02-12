<template>
  <div :key="$route.params.playspace">
    <PlaySpace v-if="playSpace" :playSpace="playSpace" />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex"

import API from "@/api/api"

import PlaySpace from "@/components/playspaces/PlaySpace"

export default {
  layout: "app",

  components: {
    PlaySpace
  },

  data: () => ({
    playSpace: undefined
  }),

  head() {
    return require("@/meta/p/_playspace")({
      title: "Temporary PlaySpace",
      desc:
        "Someone has invited you to join a PlaySpace. Come stream games, watch videos, and chat!"
    })
  },

  async mounted() {
    const { playspace } = this.$route.params
    const { data, success } = await API.temp.getOrCreateChannel(playspace)
    this.playSpace = data
  },

  methods: {
    ...mapActions({
      setCurrentPlaySpace: "playSpace/setCurrentPlaySpace"
    })
  }
}
</script>
