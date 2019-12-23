<template>
  <div
    class="playspace-sidebar relative flex flex-col bg-dark-3 text-gray-300 w-64 h-full min-w-64 px-1"
  >
    <div>
      <NavDivider class="w-full">
        <h2>Voice Chat</h2>
      </NavDivider>
      <ul class="list-style-none">
        <li
          v-for="mic in $store.state.stream.streams.mic" :key="mic.producerId"
          class="bg-black-500 shadow hover:bg-black-400 hover:shadow-reg rounded-lg mb-2"
        >
          <VoiceChatter :mic="mic" />
        </li>
      </ul>
      <div class="text-center">
        <p-btn variant="none" size="sm" class="text-sm w-full">
          <p-icon icon="fas fa-phone" class="text-xs" />
          Join Chat
        </p-btn>
      </div>
    </div>

    <div class="flex flex-col h-full">
      <NavDivider class="w-full">
        <h2>Text Chat</h2>
      </NavDivider>
      <Chat class="flex-grow mb-1" />
      <ChatBox />
      <div class="playspace-sidebar__resize absolute top-0 h-full"></div>
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
