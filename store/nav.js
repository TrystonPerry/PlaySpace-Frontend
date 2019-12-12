export default {
  state: () => ({
    side: {
      left: {
        isShown: true
      }
    },
    isMobile: false
  }),

  mutations: {
    SET_STATE(state, payload) {
      // TODO make automatic re-assignment
      state.side.left.isShown = payload.side.left.isShown
    },

    SIDE_NAV_LEFT_TOGGLE(state) {
      state.side.left.isShown = !state.side.left.isShown
      updateStorage(state)
    },

    SIDE_NAV_LEFT_SET(state, payload) {
      state.side.left.isShown = payload
      updateStorage(state)
    },

    SET_MOBILE(state, payload) {
      state.isMobile = payload
    }
  },

  actions: {
    loadFromLocalStorage({ commit }) {
      const saved = JSON.parse(localStorage.getItem("playspace-nav"))
      if (saved) {
        commit("SET_STATE", saved)
      }
    },

    toggleLeftSidebar({ commit }) {
      commit("SIDE_NAV_LEFT_TOGGLE")
    },

    setLeftSidebar({ commit }, value) {
      commit("SIDE_NAV_LEFT_SET", value)
    },

    setMobile({ commit }, value) {
      commit("SET_MOBILE", value)
    },

    updateVideoContainer() {}
  }
}

function updateStorage(state) {
  localStorage.setItem("playspace-nav", JSON.stringify(state))
}
