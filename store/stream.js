export default {
  state: () => ({
    totalVideos: 0,
    localStream: null,
    video: {
      producer: null,
      consumers: {}
    },
    audio: {
      producer: null,
      consumers: {}
    },
    mic: {
      producer: null,
      consumers: {}
    },
  }),

  getters: {
    isStreaming(state) {
      return !!state.videos.producer
    },

    isVoiceChatting() {
      return !!state.mic.producer
    }
  },

  mutations: {
    SET_TOTAL_VIDEOS(state, count) {
      state.totalVideos = count
    },
    DECREMENT_TOTAL_VIDEOS(state) {
      if (state > 0) {
        state.totalVideos--
      }
    },
    INCREMENT_TOTAL_VIDEOS(state) {
      state.totalVideos++
    },
    SET_LOCAL_STREAM(state, stream) {
      state.localStream = stream
    },
    SET_PRODUCER(state, { type, track }) {
      state[type].producer = track
    },
    SET_CONSUMER(state, { type, producerId, track }) {
      if (track) {
        state[type].consumers[producerId] = track
      } else {
        delete state[type].consumers[producerId]
      }
    },
    RESET(state) {
      state.video = {
        producer: null,
        consumers: new Set()
      }
      state.audio = {
        producer: null,
        consumers: new Set()
      }
      state.mic = {
        producers: null,
        consumers: new Set()
      }
    }
  },

  actions: {
    setTotalVideos({ commit }, count) {
      commit("SET_TOTAL_VIDEOS", count)
    },
    decrementTotalVideos({ commit }) {
      commit("DECREMENT_TOTAL_VIDEOS")
    },
    incrementTotalVideos({ commit }) {
      commit("INCREMENT_TOTAL_VIDEOS")
    },
    setLocalStream({ commit }, stream) {
      commit("SET_LOCAL_STREAM", stream)
    },
    setProducer({ commit }, options) {
      commit("SET_PRODUCER", options)
    },
    setConsumer({ commit }, options) {
      commit("SET_CONSUMER", options)
    },
    reset({ commit }) {
      commit("RESET")
    }
  }
}