<template>
  <div class="playspace relative rounded-md bg-gray-200">
    <nuxt-link :to="`/p/${stream.username}`">
      <small
        class="absolute bg-primary text-white rounded-md m-2 py-1 px-2 uppercase"
      >
        live
      </small>
      <div class="w-full overflow-hidden rounded-md">
        <img :src="stream.screenshot.url" />
      </div>
      <div class="relative p-3">
        <span
          class="playspace__viewcount absolute bg-white rounded-full py-2 px-4 shadow-reg"
        >
          <i class="fa fa-user"></i>
          {{ stream.viewerCount }} viewers
        </span>
        <div class="mt-4">
          <h2 class="font-bold mb-1" :title="stream.title">
            {{ truncatedTitle }}
          </h2>
          <h3 class="mb-3">
            <p-avatar
              :avatar="stream.avatar"
              :alt="stream.username"
              size="sm"
            />
            <span>{{ stream.username }}</span>
          </h3>
          <span
            class="mr-2 bg-green-500 text-white rounded py-1 px-2"
            title="Category"
          >
            <p-icon icon="fa fa-gamepad" />
            <span>Game</span>
          </span>
          <span v-if="stream.game" title="Game">
            <p-icon icon="fa fa-gamepad" />
            <span>{{ stream.game }}</span>
          </span>
        </div>
      </div>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  props: {
    stream: {
      type: Object,
      required: true
    }
  },

  computed: {
    truncatedTitle() {
      const length = this.stream.title.length
      let truncated = this.stream.title.substring(0, 24)
      if (length > truncated.length) {
        truncated += "..."
      }
      return truncated
    }
  }
}
</script>

<style lang="scss">
.playspace {
  &__viewcount {
    top: -1rem;
  }
}
</style>
