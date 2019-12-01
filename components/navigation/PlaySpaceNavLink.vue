<template>
  <li
    class="bg-black-500 shadow hover:bg-black-400 hover:shadow-reg rounded-lg"
  >
    <nuxt-link
      :to="`/p/${playSpace.id}`"
      class="flex"
      :class="{ 'items-center': !isLive }"
    >
      <p-avatar
        :avatar="playSpace.avatar"
        size="md"
        class="flex-shrink-0 mr-1"
      />
      <div>
        <h3 class="font-medium">{{ playSpace.channelName }}</h3>
        <div v-if="isLive">
          <p class="font-thin text-sm">{{ playSpace.title }}</p>
          <div>
            <small class="bg-green-400 pr-1 rounded text-xs">
              <p-icon icon="fas fa-game" />Game
            </small>
            <small class="ml-2 text-xs">{{ playSpace.game }}</small>
          </div>
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
    isLive() {
      return Math.random() < 0.25
    }
  }
}
</script>

<style lang="scss" scoped>
li {
  transition-duration: 100ms;

  &:hover {
    transform: scale(1.02);
  }
}
</style>
