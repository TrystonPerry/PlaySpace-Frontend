import Vue from "vue"

import VueSocketIO from "vue-socket.io"

if (process.client) {
  Vue.use(
    new VueSocketIO({
      debug: false,
      connection: process.env.API_URL,
      options: {
        useConnectionNamespace: true,
        namespaceName: "API"
      }
    })
  )

  Vue.use(
    new VueSocketIO({
      debug: false,
      connection: process.env.SFU_URL,
      options: {
        useConnectionNamespace: true,
        namespaceName: "SFU"
      }
    })
  )
}
