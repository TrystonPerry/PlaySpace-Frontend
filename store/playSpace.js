import Vue from "vue"

export default {
  state: () => ({
    current: {},
    my: []
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
    },

    // TODO rename to isOwner
    isAuthorized(state, getters, rootState) {
      const playSpace = state.current
      if (!playSpace || !playSpace.users) return false
      if (!rootState.user.username) return false
      if (playSpace.users[rootState.user.username] === "owner") {
        return true
      }
      return false
    },

    isStreamer(state, getters, rootState) {
      const playSpace = state.current
      if (!playSpace || !playSpace.users) return false
      if (!rootState.user.username) return false
      if (playSpace.users[rootState.user.username]) {
        return true
      }
    }
  },

  mutations: {
    SET_CURRENT_PLAYSPACE(state, playSpace) {
      state.current = playSpace
      Vue.set(state.current, "users", playSpace.users)
    },
    SET_MY_PLAYSPACES(state, payload) {
      state.my = payload
    },
    EDIT_USER_IN_CURRENT_PLAYSPACE(state, user) {
      if (user.rank !== "none") {
        Vue.set(state.current.users, user.username, user.rank)
      } else {
        Vue.delete(state.current.users, user.username)
      }
    },
    REMOVE_ONE_OF_MY_PLAYSPACES_BY_INDEX(state, index) {
      state.my.splice(index, 1)
    }
  },

  actions: {
    setCurrentPlaySpace({ commit }, playSpace) {
      commit("SET_CURRENT_PLAYSPACE", playSpace)
    },
    setMyPlaySpaces({ commit }, playSpaces) {
      commit("SET_MY_PLAYSPACES", playSpaces)
    },
    updateCurrentPlaySpace({ commit, state }, updates) {
      commit("SET_CURRENT_PLAYSPACE", { ...state.current, ...updates })
    },
    updateUserRankInCurrentPlaySpace({ commit }, user) {
      commit("EDIT_USER_IN_CURRENT_PLAYSPACE", user)
    },
    removeCurrentPlaySpace({ commit }) {
      commit("SET_CURRENT_PLAYSPACE", {})
    },
    removeOneOfMyPlaySpaces({ commit, state }, playSpace) {
      const index = state.my.indexOf(playSpace)
      commit("REMOVE_ONE_OF_MY_PLAYSPACES_BY_INDEX", index)
    }
  }
}
