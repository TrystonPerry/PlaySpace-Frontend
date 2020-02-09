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
          class="w-6/12 opacity-50 rounded-md"
          :class="{ 'opacity-100 bg-dark-5': isTextChat }"
        >
          <p-icon icon="fas fa-comment-alt" />
        </p-btn>
        <p-btn
          @click="isTextChat = false"
          size="sm"
          variant="none"
          class="w-6/12 opacity-50 rounded-md"
          :class="{ 'opacity-100 bg-dark-5': !isTextChat }"
        >
          <p-icon icon="fas fa-phone-alt" />
        </p-btn>
      </div>
      <div class="flex flex-col flex-grow">
        <Chat v-show="isTextChat" class="flex-grow mb-1" />
        <ChatBox v-show="isTextChat" />
        <div v-show="!isTextChat" class="flex flex-col h-full">
          <div class="opacity-75 text-sm font-bold text-center">
            ({{ chatterCount }} /
            {{ $store.state.playSpace.current.maxAudioStreams }}) users in voice
            chat
          </div>
          <ul class="list-style-none overflow-y-auto flex-grow">
            <li
              v-for="mic in $store.state.stream.streams.mic"
              :key="mic.producerId"
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
      </div>
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

  data: () => ({
    isTextChat: true
  }),

  computed: {
    chatterCount() {
      return (
        this.$store.state.stream.streams.mic.length +
        !!this.$store.state.stream.tracks.mic
      )
    }
  }
}
</script>

<style lang="scss" scoped>
li {
  transition-duration: 100ms;
}
</style>
