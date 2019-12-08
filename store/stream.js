export default {
  state: () => ({
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