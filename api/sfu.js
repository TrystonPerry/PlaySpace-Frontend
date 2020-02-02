const BASE_URL = process.env.sfuUrl

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
  getViewCount(id) {
    return axis.get(`/viewcount/${id}`)
  }
}
