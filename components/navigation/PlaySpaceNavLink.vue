<template>
  <li
    class="bg-black-500 shadow hover:bg-black-400 hover:shadow-reg rounded-lg"
    :class="
      $route.params.playspace === playSpace.id
        ? 'bg-black-700 hover:bg-black-600'
        : ''
    "
  >
    <nuxt-link
      :to="`/p/${playSpace.id}`"
      class="flex"
      :class="{ 'items-center': !stream.isLive }"
    >
      <p-avatar :avatar="playSpace.avatar" size="md" class="flex-shrink-0" />
      <div class="ml-1">
        <h3 class="font-bold">{{ playSpace.channelName }}</h3>
        <div v-if="stream.isLive">
          <p class="font-thin text-sm">{{ playSpace.title | truncate(24) }}</p>
          <!-- <div>
            <small class="bg-green-400 pr-1 rounded text-xs">
              <p-icon icon="fas fa-game" />Game
            </small>
            <small class="ml-2 text-xs">{{ playSpace.game }}</small>
          </div> -->
        </div>
      </div>
    </nuxt-link>
  </li>
</template>

<script>
export default {
  props: {
    playSpace: {
      type: Object,
      required: true
    }
  },

  computed: {
    stream() {
      return this.playSpace.stream || {}
    }
  }
}
</script>

<style lang="scss" scoped>
li {
  transition-duration: 100ms;
}
</style>
