export default {
  state: () => ({
    side: {
      left: {
        isShown: true
      }
    }
  }),

  mutations: {
    SIDE_NAV_LEFT_TOGGLE(state) {
      state.side.left.isShown = !state.side.left.isShown
    },

    SIDE_NAV_LEFT_SET(state, payload) {
      state.side.left.isShown = payload
    }
  },

  actions: {
    toggleLeftSidebar({ commit }) {
      commit("SIDE_NAV_LEFT_TOGGLE")
    },

    setLeftSidebar({ commit }, value) {
      commit("SIDE_NAV_LEFT_SET", value)
    }
  }
}
