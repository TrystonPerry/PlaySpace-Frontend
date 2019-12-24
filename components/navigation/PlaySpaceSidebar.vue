<template>
  <div
    class="playspace-sidebar relative flex flex-col bg-dark-3 text-gray-300 w-64 h-full min-w-64 px-1"
  >
    <client-only>
      <div>
        <NavDivider class="w-full">
          <h2>
            Voice Chat
            <span class="opacity-75 text-sm font-bold">
              ({{ chatterCount }} /
              {{ $store.state.playSpace.current.maxAudioStreams }})
            </span>
          </h2>
        </NavDivider>
        <ul class="list-style-none overflow-y-auto" style="max-height:10rem">
          <li
            v-for="mic in $store.state.stream.streams.mic" :key="mic.producerId"
            class="bg-black-500 shadow hover:bg-black-400 hover:shadow-reg rounded-lg mb-2"
          >
            <VoiceChatter :mic="mic" />
          </li>
          <li
            v-if="$store.state.stream.tracks.mic"
            class="bg-black-500 shadow hover:bg-black-400 hover:shadow-reg rounded-lg mb-2"
          >
            <VoiceProducer />
          </li>
        </ul>
        <div class="text-center">
          <VoiceChatControls />
        </div>
      </div>
    </client-only>

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
import VoiceProducer from "@/components/playspaces/VoiceProducer"
import VoiceChatControls from "@/components/playspaces/VoiceChatControls"
import Chat from "@/components/playspaces/Chat"
import ChatBox from "@/components/playspaces/ChatBox"

export default {
  components: {
    NavDivider,
    VoiceChatter,
    VoiceProducer,
    VoiceChatControls,
    Chat,
    ChatBox
  },

  computed: {
    chatterCount() {
      return this.$store.state.stream.streams.mic.length + !!this.$store.state.stream.tracks.mic
    }
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
