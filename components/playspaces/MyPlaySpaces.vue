<template>
  <div>
    <ul v-if="myPlaySpaces.length" class="flex flex-wrap justify-center">
      <li
        v-for="playSpace in myPlaySpaces"
        :key="playSpace.username"
        class="w-full sm:max-w-64 p-1"
      >
        <PlaySpace :stream="playSpace" class="w-full rounded-md shadow-reg" />
      </li>
    </ul>
    <div v-else class="text-center mb-8">
      <div class="text-6xl">:(</div>
      You don't have any PlaySpaces yet.
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"

import PlaySpace from "./PlaySpace"

export default {
  components: {
    PlaySpace
  },

  computed: {
    ...mapState({
      myPlaySpaces: state => state.playSpace.my
    })
  }
}
</script>

<style>
</style>