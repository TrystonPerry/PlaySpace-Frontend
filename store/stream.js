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
    },
    isSoundBlocked: false
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
    SET_YOUTUBE_VIDEO_STATE(state, { state: newState, stream }) {
      stream.state = newState
    },
    REMOVE_VIDEO_FROM_YOUTUBE_QUEUE(state, stream) {
      const i = state.streams.external.indexOf(stream)
      if (i !== -1) {
        state.streams.external[i].queue.splice(i, 1)
      }
    },
    REMOVE_STREAM(state, { type, stream }) {
      const i = state.streams[type].indexOf(stream)
      state.streams[type].splice(i, 1)
    },
    SET_IS_SOUND_BLOCKED(state, value) {
      if (state.isSoundBlocked === value) return
      state.isSoundBlocked = value
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
    setYouTubeVideoState({ commit }, info) {
      commit("SET_YOUTUBE_VIDEO_STATE", info)
    },
    removeVideoFromYouTubeQueue({ commit }, stream) {
      commit("REMOVE_VIDEO_FROM_YOUTUBE_QUEUE", stream)
    },
    removeStream({ commit }, info) {
      commit("REMOVE_STREAM", info)
    },
    setIsSoundBlocked({ commit }, value) {
      commit("SET_IS_SOUND_BLOCKED", value)
    },
    reset({ commit }) {
      commit("RESET")
    }
  }
}