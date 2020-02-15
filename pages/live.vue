<template>
  <div class="mx-auto pb-20">
    <client-only>
      <div v-if="username && myPlaySpaces.length">
        <h1 class="text-3xl text-primary text-center font-bold mt-6 mb-2">
          My PlaySpaces
        </h1>
        <MyPlaySpaces />
      </div>
    </client-only>
    <h1 class="text-3xl text-primary text-center font-bold mt-6 mb-2">
      Live PlaySpaces
    </h1>
    <ul v-if="playSpaces.length" class="flex flex-wrap justify-center">
      <li
        v-for="playSpace in playSpaces"
        :key="playSpace.username"
        class="live__item w-full sm:max-w-64 p-1"
      >
        <PlaySpace
          :stream="playSpace"
          class="w-full h-full rounded-md shadow-reg"
        />
      </li>
    </ul>
    <div v-else class="text-center">
      <h2 class="text-lg mb-3">
        There are currently no live Public PlaySpaces
      </h2>
    </div>
    <div class="text-center">
      <h1 class="text-2xl text-primary text-center font-bold mt-6 mb-2">
        Create a PlaySpace
      </h1>
      <h2 class="text-lg mb-3 mx-auto" style="max-width:450px;">
        Create a PlaySpace to watch your favorite videos, games, and more;
        together!
      </h2>
      <p-link variant="primary" to="/create">
        Create my PlaySpace
      </p-link>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"

import API from "@/api/api"

import MyPlaySpaces from "@/components/playspaces/MyPlaySpaces"

export default {
  components: {
    MyPlaySpaces
  },

  head: require("@/meta/live")(),

  async asyncData() {
    const { data, success } = await API.getLivePlaySpaces()

    return { playSpaces: data }
  },

  computed: {
    ...mapState({
      username: state => state.user.username,
      myPlaySpaces: state => state.playSpace.my
    })
  }
}
</script>

<style lang="scss" scoped>
.playspace {
  transition-duration: 50ms;

  &:hover {
    transform: scale(1.01);
    box-shadow: 0px 3px 5px 5px rgba(0, 0, 0, 0.25);
  }
}
</style>
