export default {
  state: () => ({
    tracks: {
      video: null,
      audio: null,
      mic: null,
    },
    streams: {
      video: [],
      external: [],
      mic: []
    }
  }),

  getters: {
    totalStreams(state) {
      return state.streams.video.length + state.streams.external.length + !!state.tracks.video
    }
  },

  mutations: {
    SET_LOCAL_TRACK(state, { type, track }) {
      state.tracks[type] = track
    },
    ADD_STREAM(state, { type, stream }) {
      state.streams[type].push(stream)
    },
    ADD_VIDEO_TO_YOUTUBE_QUEUE(state, { stream, videoId }) {
      const i = state.streams.external.indexOf(stream)
      if (i !== -1) {
        state.streams.external[i].queue.push(videoId)
      }
    },
    REMOVE_VIDEO_FROM_YOUTUBE_QUEUE(state, { stream, index }) {
      const i = state.streams.external.indexOf(stream)
      if (i !== -1) {
        state.streams.external[i].queue.splice(index, 1)
      }
    },
    REMOVE_STREAM(state, { type, stream }) {
      const i = state.streams[type].indexOf(stream)
      state.streams[type].splice(i, 1)
    },
    RESET(state) {
      state.tracks = {
        video: null,
        mic: null
      }
      state.streams = {
        video: [],
        external: [],
        mic: []
      }
    }
  },

  actions: {
    setLocalTrack({ commit }, options) {
      commit("SET_LOCAL_TRACK", options)
    },
    addStream({ commit }, info) {
      commit("ADD_STREAM", info)
    },
    addVideoToYouTubeQueue({ commit }, info) {
      commit("ADD_VIDEO_TO_YOUTUBE_QUEUE", info)
    },
    removeVideoFromYouTubeQueue({ commit }, info) {
      commit("REMOVE_VIDEO_FROM_YOUTUBE_QUEUE", info)
    },
    removeStream({ commit }, info) {
      commit("REMOVE_STREAM", info)
    },
    reset({ commit }) {
      commit("RESET")
    }
  }
}