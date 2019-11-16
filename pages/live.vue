<template>
  <div class="container mx-auto">
    <h1 class="h1 text-primary text-center text-3xl my-6">Live PlaySpaces</h1>
    <ul class="flex flex-wrap">
      <li
        v-for="playSpace in playSpaces"
        :key="playSpace.username"
        class="live__item w-full sm:w-6/12 md:w-4/12 lg:w-3/12 p-1 hover:bg-primary rounded-lg"
      >
        <PlaySpace :stream="playSpace" class="w-full h-full shadow-reg" />
      </li>
    </ul>
  </div>
</template>

<script>
import API from "@/api"

import PlaySpace from "@/components/playspaces/PlaySpace"

export default {
  components: {
    PlaySpace
  },

  head: {
    title: "Live - PlaySpace",
    meta: [
      { name: "description", content: "Browse all live public PlaySpaces" }
    ]
  },

  async asyncData({ context }) {
    const playSpaces = await API.getPlaySpaces()

    return { playSpaces }
  }
}
</script>

<style lang="scss" scoped>
.live__item {
  transition-duration: 50ms;

  &:hover {
    transform: scale(1.01);
    box-shadow: 0px 3px 5px 5px rgba(0, 0, 0, 0.25);
  }
}
</style>