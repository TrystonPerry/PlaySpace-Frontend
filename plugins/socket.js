import Vue from "vue"

import VueSocketIO from "vue-socket.io"

if (process.client) {
  Vue.use(
    new VueSocketIO({
      debug: false,
      connection: process.env.apiUrl || "https://api.beta.playspace",
      options: {
        useConnectionNamespace: true,
        namespaceName: "API"
      }
    })
  )

  Vue.use(
    new VueSocketIO({
      debug: false,
      connection: process.env.sfuUrl || "https://sfu.playspace.tv",
      options: {
        useConnectionNamespace: true,
        namespaceName: "SFU"
      }
    })
  )
}
