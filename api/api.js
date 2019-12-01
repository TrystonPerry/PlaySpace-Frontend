const BASE_URL = "http://localhost:3500"

const handleError = error => {
  console.error(error) // TODO better error handling
}

const axis = {
  get(url, options) {
    return fetch(`${BASE_URL}${url}`, {
      ...options
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
        Authorization: localStorage.getItem("playspace-token")
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
        Authorization: localStorage.getItem("playspace-token")
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

  async getPlaySpaces() {
    return await axis.get("/channels")
  },

  async getPlaySpace(id) {
    return await axis.get(`/channels/c/${id}`)
  },

  async createChannel(body) {
    return await axis.post(`/channels/create`, { body })
  },

  async checkChannelId(id) {
    return await axis.get(`/channels/create/id/${id}`)
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
