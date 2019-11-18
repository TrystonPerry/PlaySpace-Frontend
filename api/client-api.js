const BASE_URL = process.env.VUE_APP_API_URL || "https://api.playspace.tv"

import store from "./store/index"

const handleError = error => {
  console.error(error) // TODO better error handling
}

function getUsername() {
  return store.getters.username
}

const axis = {
  get(url, options) {
    return fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: {
        Authorization: localStorage.getItem("playspace-token"),
        username: getUsername()
      }
    })
      .then(async res => {
        const { status } = res
        const data = await res.json()

        if (status !== 200) {
          handleError(data.error)
        } else {
          data.success = true
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
        Authorization: localStorage.getItem("playspace-token"),
        username: getUsername()
      },
      body: JSON.stringify(options.body),
      method: "POST"
    })
      .then(async res => {
        const { status } = res
        const data = await res.json()

        if (status !== 200) {
          handleError(data.error)
        } else {
          data.success = true
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
        Authorization: localStorage.getItem("playspace-token"),
        username: getUsername()
      },
      body: JSON.stringify(options.body),
      method: "PUT"
    })
      .then(async res => {
        const { status } = res
        const data = await res.json()

        if (status !== 200) {
          handleError(data.error)
        } else {
          data.success = true
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

  getChannels() {
    return axis.get("/channels")
  },

  getLiveChannels() {
    return axis.get("/channels/live")
  },

  getChannel(username) {
    return axis.get(`/channels/c/${username}`)
  },

  updateChannel(username, channel) {
    return axis.put(`/channels/c/${username}`, {
      body: { channel }
    })
  },

  getViewCount(username) {
    return axis.get(`/channels/c/${username}/viewCount`)
  },

  //
  // Stream
  //

  uploadScreenshot(username, screenshotURI) {
    return axis.post(`/stream/screenshot/${username}`, {
      body: { screenshotURI }
    })
  },

  //
  // Helper
  //

  getIceServers() {
    return axis.get("/helper/ice-servers")
  },

  //
  // Chat
  //

  async banUser(banData) {
    return axis.post(`/chat/${banData.channelId}/ban`, { body: banData })
  },

  async getGif(id) {
    return axis.get(`/chat/gif/${id}`)
  },

  async getGifs(query, offset) {
    return axis.get(`/chat/gif/search?q=${query}&offset=${offset}`)
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
  }
}
