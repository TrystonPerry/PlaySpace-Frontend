<template>
  <div class="flex flex-col bg-dark-3 text-gray-300 h-full w-64 min-w-64 px-1">
    <NavDivider class="w-full mt-2">
      <h2>Voice Chat</h2>
    </NavDivider>
    <ul class="list-style-none">
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
    </ul>
    <NavDivider class="w-full">
      <h2>Text Chat</h2>
    </NavDivider>
    <Chat class="flex-grow mb-1" />
    <ChatBox />
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
  }
}
</script>

<style lang="scss" scoped>
li {
  transition-duration: 100ms;
}
</style>
