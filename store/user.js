import API from "@/api/api"

export default {
  state: () => ({
    username: "",
    fullUsername: "",
    avatar: "",
    isTwoFA: false,
    token: ""
  }),

  mutations: {
    SET_USER(state, payload) {
      if (!payload) {
        state.username = ""
        state.fullUsername = ""
        state.avatar = ""
        state.isTwoFA = false
        state.fullUse
        state.token = ""
      } else {
        state.username = payload.userData.username
        state.fullUsername = payload.userData.fullUsername
        state.avatar = payload.userData.avatar
        state.isTwoFA = payload.userData.isTwoFA
        state.token = payload.token
        if (payload.token)
          localStorage.setItem("playspace-token", payload.token)
      }
    }
  },

  getters: {
    isLoggedIn(state) {
      !!state.username
    }
  },

  actions: {
    async signup({ commit }, userData) {
      let res = await API.signup(userData)
      if (!res.error) {
        commit("SET_USER", res.data)
      }
      return res
    },

    async login({ commit }, userData) {
      let res = await API.login(userData)
      if (!res.error && !res.data.isTwoFA) {
        commit("SET_USER", res.data)
      }
      return res
    },

    async loginWith2FA({ commit }, userData) {
      let res = await API.googleAuth.twofaLogin(userData)
      if (!res.error) {
        commit("SET_USER", res)
      }
      return res
    },

    async loginWithToken({ commit }, token) {
      if (!token) token = localStorage.getItem("playspace-token")
      let isVerified = false
      if (token) {
        isVerified = await API.verifyToken(token)
      }
      if (isVerified) {
        let res = await API.loginWithToken(token)
        commit("SET_USER", { token, userData: res.data })
      } else {
        localStorage.removeItem("playspace-token")
      }
    },

    logout({ commit }) {
      commit("SET_USER")
      localStorage.removeItem("playspace-token")
    },

    async verifyToken({ commit }, token) {
      if (!token) token = localStorage.getItem("playspace-token")
      let isVerified = false
      if (token) {
        isVerified = await API.verifyToken(token)
      }
      if (!isVerified) {
        commit("SET_USER")
      }
    }
  }
}
