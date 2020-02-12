const BASE_URL = process.env.apiUrl || "https://api.playspace.tv"

import Vue from "vue"

const handleError = error => {
  console.error(error) // TODO better error handling
  Vue.notify({
    type: "error",
    title: "Error in request",
    text: error
  })
}

const axis = {
  get(url, options = {}) {
    return fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
        Authorization:
          typeof localStorage !== "undefined"
            ? localStorage.getItem("playspace-token")
            : ""
      }
    })
      .then(async res => {
        const { status } = res
        const data = await res.json()

        if (status !== 200 || !data.success) {
          handleError(data.error)
        }
        return data
      })
      .catch(handleError)
  },

  post(url, options = {}) {
    return fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
        Authorization: localStorage && localStorage.getItem("playspace-token")
      },
      body: JSON.stringify(options.body),
      method: "POST"
    })
      .then(async res => {
        const { status } = res
        const data = await res.json()

        if (status !== 200 || !data.success) {
          handleError(data.error)
        }
        return data
      })
      .catch(handleError)
  },

  put(url, options = {}) {
    return fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
        Authorization: localStorage && localStorage.getItem("playspace-token")
      },
      body: JSON.stringify(options.body),
      method: "PUT"
    })
      .then(async res => {
        const { status } = res
        const data = await res.json()

        if (status !== 200 || !data.success) {
          handleError(data.error)
        }
        return data
      })
      .catch(handleError)
  },

  delete(url, options = {}) {
    return fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
        Authorization: localStorage && localStorage.getItem("playspace-token")
      },
      body: JSON.stringify(options.body),
      method: "DELETE"
    })
      .then(async res => {
        const { status } = res
        const data = await res.json()

        if (status !== 200 || !data.success) {
          handleError(data.error)
        }
        return data
      })
      .catch(handleError)
  }
}

export default {
  //
  // Health
  //

  getHealth() {
    return axis.get("/health")
  },

  //
  // Channels
  //

  getPlaySpaces() {
    return axis.get("/channels")
  },

  getLivePlaySpaces() {
    return axis.get("/channels/live")
  },

  getPlaySpace(id) {
    return axis.get(`/channels/c/${id}`)
  },

  createChannel(body) {
    return axis.post(`/channels/create`, { body })
  },

  checkChannelId(id) {
    return axis.get(`/channels/create/id/${id}`)
  },

  updateChannel(id, body) {
    return axis.put(`/channels/c/${id}`, { body })
  },

  updateUser(id, body) {
    return axis.put(`/channels/c/${id}/users`, { body })
  },

  deleteChannel(id) {
    return axis.delete(`/channels/c/${id}`)
  },

  temp: {
    getOrCreateChannel(id) {
      return axis.post(`/channels-temp/c/${id}`)
    }
  },

  //
  // Chat
  //

  banUser(id, body) {
    return axis.post(`/chat/${id}/ban`, { body })
  },

  //
  // User
  //

  async signup(userData) {
    return await axis.post("/user/signup", { body: userData })
  },

  async checkEmail(email) {
    return await axis.get(`/user/signup/email/${email}`)
  },

  async checkUsername(username) {
    return await axis.get(`/user/signup/username/${username}`)
  },

  async login(userData) {
    return await axis.post("/user/login", { body: userData })
  },

  googleAuth: {
    async getQRCode() {
      return await axis.post("/user/settings/account/2fa/1")
    },

    async verifyCode(body) {
      return await axis.post("/user/settings/account/2fa/2", { body })
    },

    async twofaLogin(body) {
      return await axis.post("/user/login/2fa", { body })
    },

    async unlink() {
      return await axis.post("/user/settings/account/2fa/unlink")
    }
  },

  async loginWithToken(token) {
    return await axis.post("/user/decode-token", { body: { token } })
  },

  async verifyToken(token) {
    let res = await axis.post("/user/verify-token", {
      headers: { Authorization: token }
    })
    if (!res.error) return true
    return false
  },

  async getUsersPlaySpaces() {
    return await axis.get(`/user/playspaces`)
  }
}
