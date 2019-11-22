<template>
  <div class="bg-black-500 rounded-md overflow-y-auto scrollbar">
    <ul class="list-style-none flex flex-col">
      <ChatMessage
        v-for="(message, i) in messages"
        :key="i"
        :message="message"
      />
    </ul>
  </div>
</template>

<script>
import ChatMessage from "./ChatMessage"

export default {
  components: {
    ChatMessage
  },

  data: () => ({
    messages: [
      {
        username: "trystonperry",
        avatar: "",
        text: "Hello world!"
      },
      {
        username: "trystonperry",
        avatar: "",
        text: "https://i.imgur.com/pNGaJrs.png"
      },
      {
        username: "trystonperry",
        avatar: "",
        text:
          "I love PlaySpace, it's the best video sharing platform out there! I'm totally not biased. https://playspace.tv"
      },
      {
        username: "trystonperry",
        avatar: "",
        text: "https://media3.giphy.com/media/3oEjHCACoXye1k10GY/giphy.gif"
      }
    ]
  })
}
</script>

<style>
</style>