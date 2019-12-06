import { Device } from "mediasoup-client";

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
    SET_SEND_TRANSPORT(state, sendTransport) {
      state.sendTransport = sendTransport
    },
    SET_RECV_TRANSPORT(state, recvTransport) {
      state.recvTransport = recvTransport
    }
  },

  actions: {
    setProducer({ commit }, options) {
      commit("SET_PRODUCER", options)
    },
    setSendTransport({ commit }, sendTransport) {
      commit("SET_SEND_TRANSPORT", sendTransport)
    },
    setRecvTransport({ commit }, recvTransport) {
      commit("SET_RECV_TRANSPORT", recvTransport)
    }
  }
}