<template>
  <div @mouseenter="controls = true" @mouseleave="controls = false" class="h-full w-full relative">
    <div v-show="stream.queue.length > 0" class="h-full w-full">
      <div :id="stream.id" :src="src" frameborder="0" class="w-full h-full"></div>
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
      v-if="controls"
      class="controls absolute flex"
      style="left:50%;top:50%;transform:translate(-50%,-50%)"
    >
      <p-btn 
        @click="isAddVideo = !isAddVideo" 
        variant="none" 
        size="sm" 
        class="bg-green-700 mr-1 text-xs lg:text-base"
      >
        <p-icon icon="fas fa-plus" />
        Add Video
      </p-btn>
      <p-btn 
        v-if="stream.queue.length && isStreamer" 
        @click="skipCurrentVideo" 
        variant="none" 
        size="sm" 
        class="bg-blue-400 mr-1 text-xs lg:text-base"
      >
        <p-icon icon="fas fa-forward" />
        Skip Video
      </p-btn>
      <p-btn
        v-if="isStreamer"
        @click="$socket.SFU.emit('room-stream-external-close', stream.id)"
        variant="none"
        size="sm"
        class="bg-red-400 text-xs lg:text-base"
      >
        <p-icon icon="fas fa-minus" />
        Remove Player
      </p-btn>
    </div>
    <div
      v-if="controls"
      class="w-full bg-dark-4 absolute bottom-0 left-0"
    >
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
        <div class="flex items-center ">
          <p-btn variant="none">
          <p-icon icon="fas fa-pause" screen-reader-text="Pause" />
        </p-btn>
        <div 
          @mouseenter="showVolume = true"
          @mouseleave="showVolume = false"
          class="flex items-center"
        >
          <p-btn variant="none">
            <p-icon icon="fas fa-volume-up" screen-reader-text="Volume" />
          </p-btn>
          <input 
            v-if="showVolume"
            type="range" 
            class="w-24"
            min="0"
            v-model="playerData.volume"
            max="100"
          >
        </div>
        <span class="ml-2 text-xs opacity-75">
          {{ playerTime }} / {{ playerDuration }}
        </span>
        <div class="flex-grow"></div>
        <p-btn variant="none">
          <p-icon icon="fas fa-cog" screen-reader-text="Video Quality" />
        </p-btn>
        <p-btn variant="none">
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
    ignoreEvents: true,
    isBuffering: true,
    
    playerData: {
      time: 0,
      duration: 0,
      volume: 0,
      isPaused: true,
    },

    isLoadingVideo: true,
    interval: null,
    hasErroredInLastSecond: false,

    controls: true,
    showVolume: true,
    isAddVideo: false,
    youtubeUrl: ""
  }),

  mounted() {
    this.player = new YT.Player(this.stream.id, {
      videoId: this.stream.queue[0],
      playerVars: {
        controls: 0
      },
      events: {
        onReady: this.onPlayerReady,
        onStateChange: this.onPlayerStateChange
      }
    })

    setTimeout(() => {
      this.player.playVideo()

      this.seekToAnon(this.stream.time)

      if (this.stream.state !== 1) {
        this.pauseVideoAnon()
      }
      
      this.ignoreEvents = false

      // Wait for local events of loading video to be done before setting false
      setTimeout(() => this.isLoadingVideo = false, 2000)
    }, 2000)

    // Add interval to check if time and state are synced
    this.interval = setInterval(() => {
      const playerTime = this.player.getCurrentTime()

      // Add 1 second to goal time
      this.setYouTubeVideoTime({
        stream: this.stream,
        time: this.stream.time + 1
      })

      this.playerData.time = playerTime
      this.playerData.duration = this.player.getDuration()

      return

      // If is authorized to skim video
      if (this.isStreamer && !this.ignoreEvents) {
        // If there is a video
        if (this.stream.queue.length > 0) {
          if (!playerTime) return

          // If end of video has been reached
          if (playerTime >= this.player.getDuration()) {
            this.skipCurrentVideo()
            return
          }
        }
      } 
      
      // Viewer, check if they are synced with time
      else {
        this.hasErroredInLastSecond = false

        // If player time is behind or ahead by 500ms, seek to goal time
        if (playerTime < this.stream.time - 0.5 || playerTime > this.stream.time + 0.5) {
          // this.seekToAnon(this.stream.time)
        }
      }
    }, 1000)

    this.sockets.SFU.subscribe(
      `room-stream-youtube-${this.stream.id}-player-time-update`,
      ({ time }) => {
        this.setYouTubeVideoTime({ stream: this.stream, time })
        this.seekToAnon(time)
      }
    )

    this.sockets.SFU.subscribe(
      `room-stream-youtube-${this.stream.id}-played`, () => {
        this.playVideoAnon()
      }
    )

    this.sockets.SFU.subscribe(
      `room-stream-youtube-${this.stream.id}-paused`, () => {
        this.pauseVideoAnon()
      }
    )

    this.sockets.SFU.subscribe(
      `room-stream-youtube-${this.stream.id}-add-video`,
      videoId => {
        this.addVideoToYouTubeQueue({ stream: this.stream, videoId })
        // If this video is the only video in queue, play it
        if (this.stream.queue.length === 1) {
          this.loadVideoAnon(this.stream.queue[0])
        }
      }
    )

    this.sockets.SFU.subscribe(
      `room-stream-youtube-${this.stream.id}-skip-video`,
      index => {
        this.removeVideoFromYouTubeQueue({ stream: this.stream, index })
        // If skipped video is current playing video, load next video
        if (index === 0) {
          this.loadVideoAnon(this.stream.queue[0])
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
      return `${Math.floor(t/60)}:${("0"+(Math.floor(t%60))).substr(-2)}`
    },

    playerDuration() {
      const t = this.playerData.duration
      if (!t) return "0:00"
      return `${Math.floor(t/60)}:${("0"+(Math.floor(t%60))).substr(-2)}`
    }
  },

  methods: {
    ...mapActions({
      addVideoToYouTubeQueue: "stream/addVideoToYouTubeQueue",
      setYouTubeVideoState: "stream/setYouTubeVideoState",
      setYouTubeVideoTime: "stream/setYouTubeVideoTime",
      removeVideoFromYouTubeQueue: "stream/removeVideoFromYouTubeQueue"
    }),

    onPlayerReady(event) {},

    onPlayerStateChange(event) {
      return

      if (event.data !== 3 && event.data !== 2) {
        this.isBuffering = false
      }

      if (this.isBuffering && event.data === 2) {
        this.playVideoAnon()
        return
      }

      // If user is attempting to syncronize
      if (this.ignoreEvents || this.isBuffering) return

      // If user is not authorized to change state,
      // Compare state to local state instance, if its not matching (play / pause),
      // Revert to current state
      if (!this.isStreamer) {
        if (event.data !== this.stream.state) {
          if (this.stream.state === 1) {
            this.playVideoAnon()
            if (!this.hasErroredInLastSecond && !this.isLoadingVideo) {
              this.hasErroredInLastSecond = true
              this.$notify({
                type: "error",
                title: "YouTube Player Error",
                text: "You don't have permission to control this video."
              })
            }
          } else if (this.stream.state === 2) {
            this.pauseVideoAnon()
            if (!this.hasErroredInLastSecond && !this.isLoadingVideo) {
              this.hasErroredInLastSecond = true
              this.$notify({
                type: "error",
                title: "YouTube Player Error",
                text: "You don't have permission to control this video."
              })
            }
          }
        }
        return
      }
      
      switch (event.data) {
        // Unstarted
        case -1:
          break
        // Ended
        case 0:
          this.onPlayerEnded()
          break
        // Playing
        case 1:
          this.onPlayerPlay()
          break
        // Paused
        case 2:
          this.onPlayerPause()
          break
        // Buffering
        case 3:
          this.onPlayerBuffering()
          break
        // Cued
        case 5:
          this.onPlayerCued()
          break
      }
    },

    onPlayerUnstarted() {
      this.$socket.SFU.emit("room-stream-youtube-unstarted", this.stream.id)
    },

    onPlayerEnded() {},

    onPlayerPlay() {
      this.$socket.SFU.emit(`room-stream-youtube-play`, {
        id: this.stream.id,
        time: this.player.getCurrentTime()
      })
      this.playVideoAnon()
    },

    onPlayerPause() {
      this.$socket.SFU.emit(`room-stream-youtube-pause`, {
        id: this.stream.id,
        time: this.player.getCurrentTime()
      })
      this.pauseVideoAnon()
    },

    onPlayerBuffering() {
      this.isBuffering = true
    },

    onPlayerCued() {},

    loadVideoAnon(videoId) {
      this.ignoreEvents = true
      this.player.loadVideoById(videoId)
      setTimeout(() => {
        this.playVideoAnon()
        setTimeout(() => this.ignoreEvents = false, 1000)
      }, 2000)
    },

    playVideoAnon() {
      this.ignoreEvents = true
      this.setYouTubeVideoState({ state: 1, stream: this.stream })
      this.player.playVideo()
      this.ignoreEvents = false
    },

    pauseVideoAnon() {
      this.ignoreEvents = true
      this.setYouTubeVideoState({ state: 2, stream: this.stream })
      this.player.pauseVideo()
      this.ignoreEvents = false
    },

    onTimeChange(event) {
      const time = Number(event.target.value)
      this.$socket.SFU.emit(`room-steam-youtube-player-time`, {
        id: this.stream.id,
        time
      })
    },

    seekToAnon(time) {
      this.ignoreEvents = true
      this.player.seekTo(time)
      this.ignoreEvents = false
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
      this.ignoreEvents = true
      this.isLoadingVideo = true
      this.$socket.SFU.emit(`room-stream-youtube-skip-video`, {
        id: this.stream.id,
        index: 0
      })
      this.setYouTubeVideoTime({ stream: this.stream, time: 0 })
      setTimeout(() => {
        this.ignoreEvents = false,
        this.isLoadingVideo = false
      }, 2000)
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
input[type=range] {
  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
  width: 100%; /* Specific width is required for Firefox. */
  background: transparent; /* Otherwise white in Chrome */
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
}

input[type=range]:focus {
  outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
}

input[type=range]::-ms-track {
  width: 100%;
  cursor: pointer;

  /* Hides the slider so custom styles can be added */
  background: transparent; 
  border-color: transparent;
  color: transparent;
}
/* Special styling for WebKit/Blink */
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 1rem;
  width: 1rem;
  border-radius: 50%;
  background: #009dee;
  cursor: pointer;
  margin-top: -0.37rem; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
}

/* All the same stuff for Firefox */
input[type=range]::-moz-range-thumb {
  height: 1rem;
  width: 1rem;
  border-radius: 50%;
  background: #009dee;
  cursor: pointer;
}
input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 0.3rem;
  cursor: pointer;
  background: #f3f3f3;
  border-radius: 1.3px;
}

input[type=range]::-moz-range-track {
  width: 100%;
  height: 0.3rem;
  cursor: pointer;
  background: #f3f3f3;
  border-radius: 1.3px;
}

input[type=range]::-ms-track {
  width: 100%;
  height: 0.3rem;
  cursor: pointer;
  background: #f3f3f3;
  color: transparent;
}
input[type=range]::-ms-fill-lower {
  background: #009dee;
  border: 0.2px solid #010101;
}
input[type=range]::-ms-fill-upper {
  background: #f3f3f3;
}
</style>
