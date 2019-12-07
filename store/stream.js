export default {
  state: () => ({
    video: {
      producer: null,
      consumers: new Set()
    },
    audio: {
      producer: null,
      consumers: new Set()
    },
    mic: {
      producer: null,
      consumers: new Set()
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
    SET_PRODUCER(state, { type, track }) {
      state[type].producer = track
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
    setProducer({ commit }, options) {
      commit("SET_PRODUCER", options)
    },
    reset({ commit }) {
      commit("RESET")
    }
  }
}