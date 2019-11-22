const BASE_URL =
  // process.env.VUE_APP_API_URL || "https://pstv-api-beta.herokuapp.com"
  process.env.VUE_APP_API_URL || "https://api.playspace.tv"

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

  getPlaySpaces() {
    return axis.get("/channels")
  },

  getPlaySpace(handle) {
    return axis.get(`/channels/c/${handle}`)
  }
}
