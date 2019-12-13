<template>
  <div :id="stream.id" :src="src" frameborder="0" class="w-full h-full"></div>
</template>

<script>
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
    isBuffering: true
  }),

  mounted() {
    this.player = new YT.Player(this.stream.id, {
      videoId: this.stream.videoId,
      events: {
        onReady: this.onPlayerReady,
        onStateChange: this.onPlayerStateChange
      }
    })

    setTimeout(() => {
      this.player.playVideo();

      this.player.seekTo(this.stream.time, true);
      if (this.stream.state !== 1) {
        this.player.pauseVideo();
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
  },

  methods: {
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
    }
  }
}
</script>

<style>

</style>