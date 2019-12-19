import Vue from "vue"

export default {
  state: () => ({
    current: {}
  }),

  getters: {
    users(state) {
      const keys = Object.keys(state.current.users || {})
      const values = Object.values(state.current.users || {})
      let arr = []
      for (let i = 0; i < keys.length; i++) {
        arr.push({ username: keys[i], rank: values[i] })
      }
      return arr
    }
  },

  mutations: {
    SET_CURRENT_PLAYSPACE(state, playSpace) {
      state.current = playSpace
      Vue.set(state.current, "users", playSpace.users)
    },
    EDIT_USER_IN_CURRENT_PLAYSPACE(state, user) {
      if (user.rank !== "none") {
        Vue.set(state.current.users, user.username, user.rank)
      } else {
        Vue.delete(state.current.users, user.username)
      }
    }
  },

  actions: {
    setCurrentPlaySpace({ commit }, playSpace) {
      commit("SET_CURRENT_PLAYSPACE", playSpace)
    },
    updateCurrentPlaySpace({ commit, state }, updates) {
      commit("SET_CURRENT_PLAYSPACE", { ...state.current, ...updates })
    },
    updateUserRankInCurrentPlaySpace({ commit }, user) {
      commit("EDIT_USER_IN_CURRENT_PLAYSPACE", user)
    },
    removeCurrentPlaySpace({ commit }) {
      commit("SET_CURRENT_PLAYSPACE", {})
    }
  }
}
