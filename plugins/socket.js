import Vue from "vue"

import VueSocketIO from "vue-socket.io"

if (process.client) {
  Vue.use(
    new VueSocketIO({
      debug: false,
      connection: process.env.API_URL || "https://api.playspace.tv",
      options: {
        useConnectionNamespace: true,
        namespaceName: "API"
      }
    })
  )

  Vue.use(
    new VueSocketIO({
      debug: false,
      connection: process.env.SFU_URL || "https://sfu.playspace.tv",
      options: {
        useConnectionNamespace: true,
        namespaceName: "SFU"
      }
    })
  )
}
