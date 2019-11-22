<template>
  <li class="flex flex-column hover:bg-black-300 px-1">
    <p-avatar
      avatar="https://i.imgur.com/cvrQlUP.png"
      size="xs"
      class="flex-shrink-0"
    />
    <div class="w-full ml-1 max-h-64 overflow-hidden rounded-md">
      <h3 class="text-sm font-medium">{{ message.username }}</h3>
      <p
        v-if="type === 'text'"
        class="text-xs break-words"
        v-html="computedMessage"
      ></p>
      <img
        v-else-if="type === 'img'"
        :src="computedMessage"
        class="w-full rounded-md"
      />
    </div>
  </li>
</template>

<script>
const urlRegex = /(https?:\/\/)?(\w+(\.\w{2,})+(\/\S+)?)/g
const imgUrlRegex = /^(https:\/\/)(\S+\.\S{2,}\.(png|jpg|jpeg|gif|webp|svg))((\/|\?)\S+)?$/

export default {
  data: () => ({
    type: "text"
  }),

  props: {
    message: {
      type: Object
    }
  },

  computed: {
    computedMessage() {
      const { text } = this.message
      if (imgUrlRegex.test(text)) {
        this.type = "img"
        return text
      }
      let match
      let out = text
      while ((match = urlRegex.exec(text))) {
        const [full, protocol = "http://", url] = match
        const href = protocol + url
        out = out.replace(
          full,
          `<a href="${href}" class="text-primary underline" target="_blank">${url}</a>`
        )
      }
      return out
    }
  }
}
</script>

<style lang="scss" scoped>
li {
  transition-duration: 100ms;
}
</style>