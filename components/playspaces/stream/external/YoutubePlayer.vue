<template>
  <div @mouseenter="controls = true" @mouseleave="controls = false" class="h-full w-full relative">
    <div v-show="stream.queue.length > 0" class="h-full w-full">
      <div :id="stream.id" :src="src" frameborder="0" class="w-full h-full"></div>
    </div>
    <div v-show="stream.queue.length === 0" class="flex items-center justify-center text-center h-full w-full text-gray-300">
      <div>
        <p-icon icon="fab fa-youtube text-4xl" style="color:#FE0200;" />
        <h2 class="text-2xl font-medium">The Queue is Empty</h2>
        <p>Add videos to the queue to continue watching!</p>
        <p-btn
          @click="isAddVideo = !isAddVideo"
          variant="none"
          class="bg-green-700 mb-1"  
        >
          <p-icon icon="fas fa-plus" />
          Add Video
        </p-btn>
      </div>
    </div>
    <p-modal v-model="isAddVideo" class="text-left text-gray-200">
      <div class="flex items-center">
      <p-icon icon="fab fa-youtube text-4xl" style="color:#FE0200;" />
      <h2 class="text-2xl ml-2 font-medium">
        Add a YouTube Video
      </h2>
      </div>
      <h3 class="text-lg font-medium mb-2">
        Enter the video URL below
      </h3>
      <div class="flex">
        <p-input v-model="youtubeUrl" placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ" class="flex-grow" />
        <p-btn @click="addYouTubeStream" variant="primary" class="h-full">
          Add
        </p-btn>
      </div>
      <h2 class="text-2xl">
        Player Queue
      </h2>
      <ul class="list-style-none">
        <li v-for="(videoId, i) in stream.queue" :key="i" class="flex items-center">
          <h3 class="flex-grow">
            {{ videoId }}
          </h3>
          <p-tooltip text="Remove" position="left">
            <p-btn 
             @click="$socket.SFU.emit(`room-stream-youtube-skip-video`, { id: stream.id, index: i })"
              variant="none"
              size="xs"
              class="bg-red-400"
            >
              <p-icon icon="fas fa-trash" />
            </p-btn>
          </p-tooltip>
        </li>
      </ul>
    </p-modal>
    <div v-if="controls" class="absolute right-0 mr-1" style="top:50%;transform:translateY(-50%)">
      <p-tooltip text="Add Video" position="left">
        <p-btn
          @click="isAddVideo = !isAddVideo"
          variant="none"
          size="sm"
          class="bg-green-700 mb-1"  
        >
          <p-icon icon="fas fa-plus" />
        </p-btn>
      </p-tooltip>
      <p-tooltip text="Remove Player" position="left">
        <p-btn 
          @click="$socket.SFU.emit('room-stream-external-close', stream.id)" 
          variant="none" 
          size="sm" 
          class="bg-red-400"
        >
          <p-icon icon="fas fa-minus" />
        </p-btn>
      </p-tooltip>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

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

    controls: false,
    isAddVideo: false,
    youtubeUrl: "",
  }),

  mounted() {
    this.player = new YT.Player(this.stream.id, {
      videoId: this.stream.queue[0],
      events: {
        onReady: this.onPlayerReady,
        onStateChange: this.onPlayerStateChange
      }
    })

    setTimeout(() => {
      this.player.playVideo();

      this.player.seekTo(this.stream.time, true);
      if (this.stream.state !== 1) {
        // this.player.pauseVideo();
      }
      
      this.ignoreEvents = false;
    }, 2000);

    this.sockets.SFU.subscribe(`room-stream-youtube-${this.stream.id}-player-time`, () => {
      const value = this.player.getCurrentTime();
      if (!value) return
      this.$socket.SFU.emit(`room-steam-youtube-player-time`, {
        id: this.stream.id,
        value
      })
    })

    this.sockets.SFU.subscribe(`room-stream-youtube-${this.stream.id}-player-time-update`, time => {
      
      if (this.isBuffering) return

      const myTime = this.player.getCurrentTime()

      if (myTime < time - 0.5 || myTime > time + 0.5) {
        this.ignoreEvents = true
        this.player.seekTo(time)
        this.ignoreEvents = false
      }
    })

    this.sockets.SFU.subscribe(`room-stream-youtube-${this.stream.id}-unstarted`, () => {
      this.player.playVideo()
    })

    this.sockets.SFU.subscribe(`room-stream-youtube-${this.stream.id}-played`, this.playVideoAnon)

    this.sockets.SFU.subscribe(`room-stream-youtube-${this.stream.id}-paused`, this.pauseVideoAnon)

    this.sockets.SFU.subscribe(`room-stream-youtube-${this.stream.id}-add-video`, videoId => {
      this.addVideoToYouTubeQueue({ stream: this.stream, videoId })
      if (this.stream.queue.length === 1) {
        this.player.loadVideoById(this.stream.queue[0])
      }
    })

    this.sockets.SFU.subscribe(`room-stream-youtube-${this.stream.id}-skip-video`, index => {
      this.removeVideoFromYouTubeQueue({ stream: this.stream, index })
      if (index === 0) {
        this.player.loadVideoById(this.stream.queue[0])
      }
    })
  },

  methods: {
    ...mapActions({
      "addVideoToYouTubeQueue": "stream/addVideoToYouTubeQueue",
      "removeVideoFromYouTubeQueue": "stream/removeVideoFromYouTubeQueue"
    }),

    onPlayerReady(event) {},

    onPlayerStateChange(event) {
      if (event.data !== 3 && event.data !== 2) {
        this.isBuffering = false;
      }

      if (this.isBuffering && event.data === 2) {
        this.player.playVideo();
      }

      if (this.ignoreEvents) return;

      switch (event.data) {
        // Unstarted
        case -1:
          break;
        // Ended
        case 0:
          this.onPlayerEnded();
          break;
        // Playing
        case 1:
          this.onPlayerPlay();
          break;
        // Paused
        case 2:
          this.onPlayerPause();
          break;
        // Buffering
        case 3:
          this.onPlayerBuffering();
          break;
        // Cued
        case 5:
          this.onPlayerCued();
          break;
      }
    },

    onPlayerUnstarted() {
      this.$socket.SFU.emit("room-stream-youtube-unstarted", this.stream.id)
    },

    onPlayerEnded() {},

    onPlayerPlay() {
      this.$socket.SFU.emit(`room-stream-youtube-play`, this.stream.id)
    },

    onPlayerPause() {
      this.$socket.SFU.emit(`room-stream-youtube-pause`, this.stream.id)
    },

    onPlayerBuffering() {
      this.isBuffering = true
    },

    onPlayerCued() {},

    playVideoAnon() {
      this.ignoreEvents = true;
      this.player.playVideo();
      this.ignoreEvents = false;
    },

    pauseVideoAnon() {
      this.ignoreEvents = true;
      this.player.pauseVideo();
      this.ignoreEvents = false;
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
    }
  }
}
</script>

<style>

</style>