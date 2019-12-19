<template>
  <div
    class="playspace-sidebar flex flex-col bg-dark-3 text-gray-300 w-full h-full px-1"
  >
    <div class="flex flex-col h-full">
      <div class="flex my-1">
        <p-btn
          @click="isTextChat = true"
          size="sm"
          variant="none"
          class="w-6/12 opacity-50"
          :class="{ 'underline opacity-100': isTextChat }"
        >
          <p-icon icon="fas fa-comment-alt" />
          Text Chat
        </p-btn>
        <p-btn
          @click="isTextChat = false"
          size="sm"
          variant="none"
          class="w-6/12 opacity-50"
          :class="{ 'underline opacity-100': !isTextChat }"
        >
          <p-icon icon="fas fa-phone-alt" />
          Voice Chat
        </p-btn>
      </div>
      <div class="flex flex-col flex-grow">
        <Chat v-if="isTextChat" class="flex-grow mb-1" />
        <ChatBox v-if="isTextChat" />
        <!-- <ul v-if="!isTextChat" class="list-style-none">
          <li
            class="bg-black-500 shadow hover:bg-black-400 hover:shadow-reg rounded-lg mb-2"
          >
            <VoiceChatter :playSpace="{ username: 'trystonperry' }" />
          </li>
          <li
            class="bg-black-500 shadow hover:bg-black-400 hover:shadow-reg rounded-lg mb-2"
          >
            <VoiceChatter :playSpace="{ username: 'justadamokay' }" />
          </li>
          <li
            class="bg-black-500 shadow hover:bg-black-400 hover:shadow-reg rounded-lg mb-2"
          >
            <VoiceChatter :playSpace="{ username: 'deusmat' }" />
          </li>
          <li
            class="bg-black-500 shadow hover:bg-black-400 hover:shadow-reg rounded-lg mb-2"
          >
            <VoiceChatter :playSpace="{ username: 'renoops' }" />
          </li>
        </ul> -->
      </div>
    </div>
  </div>
</template>

<script>
import NavDivider from "./NavDivider"
import VoiceChatter from "@/components/playspaces/VoiceChatter"
import Chat from "@/components/playspaces/Chat"
import ChatBox from "@/components/playspaces/ChatBox"

export default {
  components: {
    NavDivider,
    VoiceChatter,
    Chat,
    ChatBox
  },

  data: () => ({
    isTextChat: true
  })
}
</script>

<style lang="scss" scoped>
li {
  transition-duration: 100ms;
}
</style>
