export default {
  state: () => ({
    producerIds: {
      video: null,
      audio: null,
      mic: null
    },
    tracks: {
      video: null,
      audio: null,
      mic: null
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
      return (
        state.streams.video.length +
        state.streams.external.length +
        !!state.tracks.video
      )
    },

    totalExternalStreams(state) {
      return state.streams.external.length
    },

    isStreaming(state) {
      return !!state.tracks.video
    }
  },

  mutations: {
    SET_LOCAL_TRACK(state, { type, track }) {
      state.tracks[type] = track
    },
    SET_PRODUCER_ID(state, { type, producerId }) {
      state.producerIds[type] = producerId
    },
    ADD_STREAM(state, { type, stream }) {
      state.streams[type].push(stream)
    },
    ADD_VIDEO_TO_YOUTUBE_QUEUE(state, { stream, videoId, video }) {
      stream.queue.push(videoId)
      stream.queueMetaData.push(video)
    },
    SET_YOUTUBE_VIDEO_STATE(state, { state: newState, stream }) {
      stream.state = newState
    },
    SET_YOUTUBE_VIDEO_TIME(state, { stream, time }) {
      stream.time = time
    },
    REMOVE_VIDEO_FROM_YOUTUBE_QUEUE(state, { stream, index }) {
      stream.queue.splice(index, 1)
      stream.queueMetaData.splice(index, 1)
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
    setProducerId({ commit }, info) {
      commit("SET_PRODUCER_ID", info)
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
    setYouTubeVideoTime({ commit }, info) {
      commit("SET_YOUTUBE_VIDEO_TIME", info)
    },
    removeVideoFromYouTubeQueue({ commit }, info) {
      commit("REMOVE_VIDEO_FROM_YOUTUBE_QUEUE", info)
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
