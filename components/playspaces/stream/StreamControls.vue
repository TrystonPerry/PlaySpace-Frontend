<template>
  <div @mouseenter="controls = true" @mouseleave="controls = false" class="h-full w-full relative">
    <!-- Video player / Empty queue controls -->
    <div v-show="isVideo || stream.type === 'twitch'" class="w-full h-full">
      <slot></slot>
    </div>
    <div
      v-if="!isVideo"
      class="flex items-center justify-center text-center h-full w-full text-gray-300"
    >
      <div>
        <div class="mb-2">
          <p-icon icon="fab fa-youtube text-2xl pr-2" style="color:#FE0200;" />
          <p-icon icon="fab fa-dailymotion text-2xl" style="color:rgb(40, 179, 200);" />
          <h2 class="text-2xl font-bold">The Queue is Empty</h2>
          <p>Add videos to the queue to continue watching!</p>
        </div>
        <p-btn @click="isAddVideo = !isAddVideo" variant="none" class="bg-green-700">
          <p-icon icon="fas fa-plus" />Add Video
        </p-btn>
        <p-btn
          v-if="isStreamer"
          @click="$socket.SFU.emit('room-stream-external-close', stream.id)"
          variant="none"
          class="bg-red-400"
        >
          <p-icon icon="fas fa-minus" />Remove Player
        </p-btn>
      </div>
    </div>

    <!-- Video Controls Center Overlay -->
    <div
      v-if="pc.center && controls && queue.length"
      class="controls absolute flex"
      style="left:50%;top:50%;transform:translate(-50%,-50%)"
    >
      <p-btn
        v-if="pc.center.addVideo"
        @click="isAddVideo = !isAddVideo"
        variant="none"
        size="sm"
        class="bg-green-700 mr-1 text-xs lg:text-base"
      >
        <p-icon icon="fas fa-plus" />Add Video
      </p-btn>
      <p-btn
        v-if="pc.center.skipVideo && queue.length && isStreamer"
        @click="$emit('skipVideo', queueIds[0])"
        variant="none"
        size="sm"
        class="bg-blue-400 mr-1 text-xs lg:text-base"
      >
        <p-icon icon="fas fa-forward" />Skip Video
      </p-btn>
      <p-btn
        v-if="pc.center.removePlayer && isStreamer"
        @click="$socket.SFU.emit('room-stream-external-close', stream.id)"
        variant="none"
        size="sm"
        class="bg-red-400 text-xs lg:text-base"
      >
        <p-icon icon="fas fa-minus" />Remove Player
      </p-btn>
    </div>

    <!-- Video Down Controls -->
    <div
      v-if="pc.downBar && controls && queue.length"
      class="w-full bg-dark-4 absolute bottom-0 left-0"
    >
      <div v-if="isStreamer" class="relative w-full h-full">
        <input
          type="range"
          @input="$emit('timeChange', $event)"
          min="0"
          :value="stream.time"
          :max="playerData.duration"
          class="absolute left-0 w-full h-4"
          style="top:-0.5rem"
        />
      </div>
      <div class="flex items-center">
        <div v-if="isStreamer">
          <p-btn v-if="stream.state === 1" @click="onPause" variant="none">
            <p-icon icon="fas fa-pause" screen-reader-text="Pause" />
          </p-btn>
          <p-btn v-else @click="onPlay" variant="none">
            <p-icon icon="fas fa-play" screen-reader-text="Play" />
          </p-btn>
        </div>
        <div @mouseenter="showVolume" @mouseleave="hideVolume" class="flex items-center">
          <p-btn @click="toggleMute" variant="none" class="w-12">
            <p-icon v-if="playerData.isMuted" icon="fas fa-volume-mute" />
            <p-icon v-else-if="playerData.volume > 50" icon="fas fa-volume-up" />
            <p-icon v-else icon="fas fa-volume-down" />
          </p-btn>
          <input
            v-if="playerData.showVolume"
            :value="playerData.volume"
            @input="updateVolume($event)"
            type="range"
            class="w-24"
            min="0"
            max="100"
          />
        </div>
        <span class="ml-2 text-xs opacity-75">{{ playerTime }} / {{ playerDuration }}</span>
        <div class="flex-grow"></div>
        <!-- <p-btn variant="none">
            <p-icon icon="fas fa-cog" screen-reader-text="Video Quality" />
        </p-btn>-->
        <!-- <p-btn @click="controls = !controls" variant="none">
          <p-icon icon="fas fa-minus-square" screen-reader-text="Hide Controls" />
        </p-btn>-->
        <p-btn @click="$emit('toggleFullscreen')" variant="none">
          <p-icon icon="fas fa-expand" screen-reader-text="Fullscreen" />
        </p-btn>
      </div>
    </div>

    <!-- Add video to queue modal -->
    <p-modal v-model="isAddVideo" class="text-left text-gray-200">
      <div class="flex items-center">
        <p-icon icon="fab fa-youtube text-2xl pr-2" style="color:#FE0200;" />
        <p-icon icon="fab fa-dailymotion text-2xl" style="color:rgb(40, 179, 200);" />
        <h2 class="text-2xl ml-2 font-bold">Add a Video</h2>
      </div>
      <h3 class="text-lg font-bold mb-2">Enter the video URL below</h3>
      <form @submit.prevent="addVideo" class="flex">
        <p-input
          v-model="url"
          placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          class="flex-grow"
        />
        <p-btn variant="primary" type="submit" class="h-full">Add</p-btn>
      </form>
      <div v-if="queue.length > 0" class="mt-2">
        <h2 class="text-2xl">Player Queue</h2>
        <ul class="queue list-style-none overflow-y-auto">
          <li v-for="(video, i) in queue" :key="i" class="flex items-center mb-1 rounded p-1">
            <div v-if="video.data" class="flex flex-grow">
              <div class="relative flex-shrink-0 mr-2 rounded" style="max-width:12rem">
                <img
                  :src="queue[0].type === 'youtube' ? `https://i.ytimg.com/vi/${video.videoId}/mqdefault.jpg` : `https://dailymotion.com/thumbnail/video/${video.videoId}`"
                  class="w-full h-full rounded"
                />
                <small
                  v-if="video.data.duration"
                  class="absolute bg-black-700 px-1 rounded-br"
                  style="bottom:0;right:0;"
                >{{ video.data.duration }}</small>
              </div>
              <div class="flex flex-col justify-center">
                <h3 class="text-lg font-bold">{{ video.data.title }}</h3>
                <small
                  v-if="video.data.publishedAt"
                >Uploaded on {{ video.data.publishedAt | formatDate }}</small>
                <div>
                  <p-btn
                    v-if="isStreamer && i > 0"
                    @click="$emit('skipVideo', queueIds[i])"
                    variant="none"
                    size="xs"
                    class="bg-red-400 text-xs"
                  >
                    <p-icon icon="fas fa-trash" />Remove
                  </p-btn>
                  <p-btn
                    v-if="isStreamer && i === 0"
                    @click="$emit('skipVideo', queueIds[0])"
                    variant="none"
                    size="xs"
                    class="bg-blue-400 text-xs"
                  >
                    <p-icon icon="fas fa-forward" />Skip Video
                  </p-btn>
                  <i v-if="i === 0" class="text-sm">(Currently playing)</i>
                </div>
              </div>
            </div>
            <div v-else>{{ video.videoId }}</div>
          </li>
        </ul>
      </div>
    </p-modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

import playerControls from "@/data/playerControls"

const regex = {
  youtubeUrl: /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/,
  dailymotionUrl: /https?:\/\/(www.)?(dailymotion.com|dai.ly)(\/video)?\/(.{7})/
}

export default {
  props: {
    stream: {
      type: Object,
      required: true
    },

    playerData: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    controls: false,
    isAddVideo: false,
    url: ""
  }),

  computed: {
    ...mapGetters({
      isStreamer: "playSpace/isStreamer"
    }),

    queue() {
      return Object.values(this.stream.queue) || []
    },

    queueIds() {
      return Object.keys(this.stream.queue) || []
    },

    pc() {
      if (this.stream.type === "twitch") return playerControls["twitch"]
      if (!this.queue.length) return {}
      return playerControls[this.queue[0].type]
    },

    isVideo() {
      if (this.stream.type === "twitch") return true
      return (
        this.queue.length &&
        ["youtube", "dailymotion"].includes(this.queue[0].type)
      )
    },

    playerTime() {
      const t = this.stream.time
      if (!t) return "0:00"
      return `${Math.floor(t / 60)}:${("0" + Math.floor(t % 60)).substr(-2)}`
    },

    playerDuration() {
      const t = this.playerData.duration
      if (!t) return "0:00"
      return `${Math.floor(t / 60)}:${("0" + Math.floor(t % 60)).substr(-2)}`
    }
  },

  methods: {
    addVideo() {
      let videoId
      let type

      const match = this.url.match(regex.youtubeUrl)
      if (match) {
        videoId = match[7].length === 11 ? match[7] : false
        type = "youtube"
      }

      const match2 = this.url.match(regex.dailymotionUrl)
      if (match2) {
        videoId = match2[4]
        type = "dailymotion"
      }
      // TODO notify that it's an invalid URL
      if (!videoId) return

      this.$socket.SFU.emit("room-stream-video-add-video", {
        id: this.stream.id,
        type,
        videoId
      })

      this.url = ""
    },

    onPlay() {
      this.$emit("play")
    },

    onPause() {
      this.$emit("pause")
    },

    showVolume() {
      this.$emit("updatePlayerData", { showVolume: true })
    },

    hideVolume() {
      this.$emit("updatePlayerData", { showVolume: false })
    },

    toggleMute() {
      this.$emit("updatePlayerData", { isMuted: !this.playerData.isMuted })
    },

    updateVolume(event) {
      this.$emit("updatePlayerData", { volume: event.target.value })
    }
  }
}
</script>

<style lang="scss" scoped>
.queue {
  li:nth-child(even) {
    @apply bg-dark-4;
  }
}
input[type="range"] {
  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
  width: 100%; /* Specific width is required for Firefox. */
  background: transparent; /* Otherwise white in Chrome */
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
}

input[type="range"]:focus {
  outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
}

input[type="range"]::-ms-track {
  width: 100%;
  cursor: pointer;

  /* Hides the slider so custom styles can be added */
  background: transparent;
  border-color: transparent;
  color: transparent;
}
/* Special styling for WebKit/Blink */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 1rem;
  width: 1rem;
  border-radius: 50%;
  background: #009dee;
  cursor: pointer;
  margin-top: -0.37rem; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
}

/* All the same stuff for Firefox */
input[type="range"]::-moz-range-thumb {
  height: 1rem;
  width: 1rem;
  border-radius: 50%;
  background: #009dee;
  cursor: pointer;
}
input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 0.3rem;
  cursor: pointer;
  background: #f3f3f3;
  border-radius: 1.3px;
}

input[type="range"]::-moz-range-track {
  width: 100%;
  height: 0.3rem;
  cursor: pointer;
  background: #f3f3f3;
  border-radius: 1.3px;
}

input[type="range"]::-ms-track {
  width: 100%;
  height: 0.3rem;
  cursor: pointer;
  background: #f3f3f3;
  color: transparent;
}
input[type="range"]::-ms-fill-lower {
  background: #009dee;
  border: 0.2px solid #010101;
}
input[type="range"]::-ms-fill-upper {
  background: #f3f3f3;
}
</style>