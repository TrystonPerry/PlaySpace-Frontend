export default {
  state: () => ({
    current: {}
  }),

  mutations: {
    SET_CURRENT_PLAYSPACE(state, playSpace) {
      state.current = playSpace
    }
  },

  actions: {
    setCurrentPlaySpace({ commit }, playSpace) {
      commit("SET_CURRENT_PLAYSPACE", playSpace)
    },
    updateCurrentPlaySpace({ commit, state }, updates) {
      commit("SET_CURRENT_PLAYSPACE", { ...state.current, ...updates })
    },
    removeCurrentPlaySpace({ commit }) {
      commit("SET_CURRENT_PLAYSPACE", {})
    }
  }
}
