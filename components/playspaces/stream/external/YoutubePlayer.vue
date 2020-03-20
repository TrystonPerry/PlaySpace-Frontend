<template>
  <div
    @mouseenter="controls = true"
    @mouseleave="controls = false"
    :id="`${stream.id}-container`"
    class="h-full w-full relative"
  >
    <div v-show="stream.queue.length > 0" class="h-full w-full">
      <div
        :id="stream.id"
        :src="src"
        frameborder="0"
        class="w-full h-full"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      ></div>
    </div>
    <div
      v-show="stream.queue.length === 0"
      class="flex items-center justify-center text-center h-full w-full text-gray-300"
    >
      <div>
        <div class="mb-2">
          <p-icon icon="fab fa-youtube text-4xl" style="color:#FE0200;" />
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
    <p-modal v-model="isAddVideo" class="text-left text-gray-200">
      <div class="flex items-center">
        <p-icon icon="fab fa-youtube text-4xl" style="color:#FE0200;" />
        <h2 class="text-2xl ml-2 font-bold">Add a YouTube Video</h2>
      </div>
      <h3 class="text-lg font-bold mb-2">Enter the video URL below</h3>
      <form @submit.prevent="addYouTubeStream" class="flex">
        <p-input
          v-model="youtubeUrl"
          placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          class="flex-grow"
        />
        <p-btn variant="primary" type="submit" class="h-full">Add</p-btn>
      </form>
      <div v-if="stream.queue.length > 0" class="mt-2">
        <h2 class="text-2xl">Player Queue</h2>
        <ul class="queue list-style-none overflow-y-auto">
          <li
            v-for="(videoId, i) in stream.queue"
            :key="i"
            class="flex items-center mb-1 rounded p-1"
          >
            <h3 class="flex-grow">{{ videoId }}</h3>
            <p-tooltip v-if="isStreamer" text="Remove" position="left">
              <p-btn
                @click="
                  $socket.SFU.emit(`room-stream-youtube-skip-video`, {
                    id: stream.id,
                    index: i
                  })
                "
                variant="none"
                size="xs"
                class="bg-red-400"
              >
                <p-icon icon="fas fa-trash" />
              </p-btn>
            </p-tooltip>
          </li>
        </ul>
      </div>
    </p-modal>
    <div
      v-if="controls && stream.queue.length"
      class="controls absolute flex"
      style="left:50%;top:50%;transform:translate(-50%,-50%)"
    >
      <p-btn
        @click="isAddVideo = !isAddVideo"
        variant="none"
        size="sm"
        class="bg-green-700 mr-1 text-xs lg:text-base"
      >
        <p-icon icon="fas fa-plus" />Add Video
      </p-btn>
      <p-btn
        v-if="stream.queue.length && isStreamer"
        @click="skipCurrentVideo"
        variant="none"
        size="sm"
        class="bg-blue-400 mr-1 text-xs lg:text-base"
      >
        <p-icon icon="fas fa-forward" />Skip Video
      </p-btn>
      <p-btn
        v-if="isStreamer"
        @click="$socket.SFU.emit('room-stream-external-close', stream.id)"
        variant="none"
        size="sm"
        class="bg-red-400 text-xs lg:text-base"
      >
        <p-icon icon="fas fa-minus" />Remove Player
      </p-btn>
    </div>
    <div v-if="controls && stream.queue.length" class="w-full bg-dark-4 absolute bottom-0 left-0">
      <div v-if="isStreamer" class="relative w-full h-full">
        <input
          type="range"
          @input="onTimeChange($event)"
          min="0"
          :value="playerData.time"
          :max="playerData.duration"
          class="absolute left-0 w-full h-4"
          style="top:-0.5rem"
        />
      </div>
      <div class="flex items-center">
        <div v-if="isStreamer">
          <p-btn v-if="!playerData.isPaused" @click="onPause" variant="none">
            <p-icon icon="fas fa-pause" screen-reader-text="Pause" />
          </p-btn>
          <p-btn v-else @click="onPlay" variant="none">
            <p-icon icon="fas fa-play" screen-reader-text="Play" />
          </p-btn>
        </div>
        <div
          @mouseenter="showVolume = true"
          @mouseleave="showVolume = false"
          class="flex items-center"
        >
          <p-btn @click="playerData.isMuted = !playerData.isMuted" variant="none" class="w-12">
            <p-icon v-if="playerData.isMuted" icon="fas fa-volume-mute" />
            <p-icon v-else-if="playerData.volume > 50" icon="fas fa-volume-up" />
            <p-icon v-else icon="fas fa-volume-down" />
          </p-btn>
          <input
            v-if="showVolume"
            v-model="playerData.volume"
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
        <p-btn @click="toggleFullscreen" variant="none">
          <p-icon icon="fas fa-expand" screen-reader-text="Fullscreen" />
        </p-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

const regex = {
  youtubeUrl: /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/
}

export default {
  props: {
    src: {
      type: String,
      required: true
    },
    stream: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    player: null,

    playerData: {
      time: 0,
      duration: 0,
      volume: 100,
      isMuted: true,
      isPaused: true,
      isFullscreen: true
    },

    // TODO temp, this is a temp solution
    skippedInLastSecond: false,

    interval: null,
    controls: false,
    showVolume: false,
    isAddVideo: false,
    youtubeUrl: ""
  }),

  mounted() {
    this.player = new YT.Player(this.stream.id, {
      videoId: this.stream.queue[0],
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablenewui: 1,
        modestbranding: 1,
        playsinline: 1
      },
      events: {
        onStateChange: this.onPlayerStateChange
      }
    })

    setTimeout(() => {
      // TODO move this to its own store
      // Get volume from localStorage
      const playerData = JSON.parse(localStorage.getItem("playspace-player"))
      if (playerData) {
        this.playerData.volume = playerData.youtube.volume
      }

      // Set volume initially
      this.player.setVolume(this.playerData.volume)
      this.playerData.isMuted = this.playerData.volume === 0

      // Load video
      this.playVideo()
      this.playerData.isPaused = false

      // If brand new player
      if (this.stream.state === -1) {
        this.setYouTubeVideoState({
          stream: this.stream,
          state: 1
        })
      }

      // If video is playing, update time
      else if (this.stream.state === 1) {
        this.setYouTubeVideoTime({
          stream: this.stream,
          time: this.stream.time + 2
        })
      }

      // If player is paused, pause it
      else if (this.stream.state === 2) {
        this.pauseVideo()
        this.playerData.isPaused = true
      }

      this.seekTo(this.stream.time)
    }, 2000)

    // Add interval to check if time and state are synced
    this.interval = setInterval(() => {
      const playerTime = this.player.getCurrentTime()
      const playerDuration = this.player.getDuration()

      // Add 1 second to goal time
      this.setYouTubeVideoTime({
        stream: this.stream,
        time: this.stream.time + 1
      })

      if (playerDuration !== 0 && playerTime >= playerDuration) {
        this.skipCurrentVideo()
      }

      // Update player time info
      this.playerData.time = playerTime
      this.playerData.duration = playerDuration
    }, 1000)

    // On new time
    this.sockets.SFU.subscribe(
      `room-stream-youtube-${this.stream.id}-player-time-update`,
      ({ time }) => {
        this.setYouTubeVideoTime({ stream: this.stream, time })
        this.seekTo(time)
      }
    )

    // On play
    this.sockets.SFU.subscribe(
      `room-stream-youtube-${this.stream.id}-played`,
      () => {
        this.playVideo()
        this.setYouTubeVideoState({ state: 1, stream: this.stream })
        this.playerData.isPaused = false
      }
    )

    // On pause
    this.sockets.SFU.subscribe(
      `room-stream-youtube-${this.stream.id}-paused`,
      () => {
        this.pauseVideo()
        this.setYouTubeVideoState({ state: 2, stream: this.stream })
        this.playerData.isPaused = true
      }
    )

    this.sockets.SFU.subscribe(
      `room-stream-youtube-${this.stream.id}-add-video`,
      videoId => {
        this.addVideoToYouTubeQueue({ stream: this.stream, videoId })
        // If this video is the only video in queue, play it
        if (this.stream.queue.length === 1) {
          this.loadVideo(this.stream.queue[0])
          this.onPlay()
        }
      }
    )

    // On video skip
    this.sockets.SFU.subscribe(
      `room-stream-youtube-${this.stream.id}-skip-video`,
      index => {
        if (this.skippedInLastSecond) return

        this.skippedInLastSecond = true
        setTimeout(() => (this.skippedInLastSecond = false), 1000)

        this.removeVideoFromYouTubeQueue({ stream: this.stream, index })

        // If no more videos in queue
        if (!this.stream.queue.length) {
          this.pauseVideo()
          this.setYouTubeVideoState({ state: 2, stream: this.stream })
        }

        // If skipped video is current playing video, load next video
        else if (index === 0) {
          this.loadVideo(this.stream.queue[0])
          this.onPlay()
        }
      }
    )
  },

  beforeDestroy() {
    clearInterval(this.interval)
  },

  computed: {
    ...mapGetters({
      isStreamer: "playSpace/isStreamer"
    }),

    playerTime() {
      const t = this.playerData.time
      if (!t) return "0:00"
      return `${Math.floor(t / 60)}:${("0" + Math.floor(t % 60)).substr(-2)}`
    },

    playerDuration() {
      const t = this.playerData.duration
      if (!t) return "0:00"
      return `${Math.floor(t / 60)}:${("0" + Math.floor(t % 60)).substr(-2)}`
    }
  },

  watch: {
    "playerData.volume"(volume) {
      this.player.setVolume(volume)
      // TODO update this code, move it to vuex store
      const playerData = {
        youtube: {
          volume
        }
      }
      localStorage.setItem("playspace-player", JSON.stringify(playerData))
      if (volume > 0) this.playerData.isMuted = false
      else this.playerData.isMuted = true
    },
    "playerData.isMuted"(val) {
      if (val) this.player.mute()
      else this.player.unMute()
    }
  },

  methods: {
    ...mapActions({
      addVideoToYouTubeQueue: "stream/addVideoToYouTubeQueue",
      setYouTubeVideoState: "stream/setYouTubeVideoState",
      setYouTubeVideoTime: "stream/setYouTubeVideoTime",
      removeVideoFromYouTubeQueue: "stream/removeVideoFromYouTubeQueue"
    }),

    onPlayerStateChange(event) {
      if (event.data === 1 && this.stream.state === 2) {
        this.pauseVideo()
      } else if (event.data === 2 && this.stream.state === 1) {
        this.playVideo()
      }
    },

    onPlay() {
      this.$socket.SFU.emit(`room-stream-youtube-play`, {
        id: this.stream.id,
        time: this.player.getCurrentTime() || 0
      })
      this.setYouTubeVideoState({ state: 1, stream: this.stream })
      this.playerData.isPaused = false
      this.playVideo()
    },

    onPause() {
      this.$socket.SFU.emit(`room-stream-youtube-pause`, {
        id: this.stream.id,
        time: this.player.getCurrentTime()
      })
      this.setYouTubeVideoState({ state: 2, stream: this.stream })
      this.playerData.isPaused = true
      this.pauseVideo()
    },

    loadVideo(videoId) {
      this.player.loadVideoById(videoId)
    },

    playVideo() {
      this.player.playVideo()
    },

    pauseVideo() {
      this.player.pauseVideo()
    },

    onTimeChange(event) {
      // TODO: throttle this function
      const time = Number(event.target.value)
      this.$socket.SFU.emit(`room-steam-youtube-player-time`, {
        id: this.stream.id,
        time
      })
    },

    seekTo(time) {
      this.player.seekTo(time)
    },

    addYouTubeStream() {
      const match = this.youtubeUrl.match(regex.youtubeUrl)

      const url = match && match[7].length === 11 ? match[7] : false

      // TODO notify that it's an invalid URL
      if (!url) return

      this.$socket.SFU.emit("room-stream-youtube-add-video", {
        id: this.stream.id,
        videoId: url
      })

      this.youtubeUrl = ""
    },

    skipCurrentVideo() {
      this.$socket.SFU.emit(`room-stream-youtube-skip-video`, {
        id: this.stream.id,
        index: 0
      })
    },

    toggleFullscreen() {
      // If is in fullscreen
      if (document.fullscreenElement) {
        document.exitFullscreen()
        return
      }
      document.getElementById(this.stream.id + "-container").requestFullscreen()
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
