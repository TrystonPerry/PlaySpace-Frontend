<template>
  <div
    class="playspace-sidebar relative flex flex-col bg-dark-3 text-gray-300 w-64 h-full min-w-64 px-1"
  >
    <NavDivider class="w-full mt-2">
      <h2>Voice Chat</h2>
    </NavDivider>
    <!-- <ul class="list-style-none">
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
    <NavDivider class="w-full">
      <h2>Text Chat</h2>
    </NavDivider>
    <Chat class="flex-grow mb-1" />
    <ChatBox />
    <div class="playspace-sidebar__resize absolute top-0 h-full"></div>
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
.playspace-sidebar {
  resize: horizontal;
  overflow-x: auto;

  &__resize {
    cursor: ew-resize;
    width: 4px;
    left: 0px;
  }
}
li {
  transition-duration: 100ms;
}
</style>
