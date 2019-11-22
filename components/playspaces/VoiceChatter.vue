<template>
  <div class="flex items-center">
    <p-avatar
      avatar="https://i.imgur.com/cvrQlUP.png"
      size="sm"
      class="flex-shrink-0 mr-1"
    />
    <h3 class="flex-grow">
      {{ playSpace.username }}
    </h3>
    <button>
      <p-icon
        icon="fas fa-volume-mute"
        size="md"
        screen-reader-text="Mute"
        class="mr-5"
      />
    </button>
  </div>
</template>

<script>
export default {
  props: {
    playSpace: {
      type: Object,
      required: true
    }
  }
}
</script>

<style></style>
