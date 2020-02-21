export default {
  state: () => ({
    side: {
      left: {
        isShown: false
      }
    },
    isMobile: false,
    modal: ""
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
    },

    SET_MODAL(state, payload) {
      state.modal = payload
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

    setModal({ commit }, value) {
      commit("SET_MODAL", value)
    },

    // Just used to force update for video container, no real functionality
    updateVideoContainer() {}
  }
}

function updateStorage(state) {
  localStorage.setItem("playspace-nav", JSON.stringify(state))
}
