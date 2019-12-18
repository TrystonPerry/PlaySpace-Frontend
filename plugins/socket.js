import Vue from "vue"

import VueSocketIO from "vue-socket.io"

if (process.client) {
  Vue.use(
    new VueSocketIO({
      debug: false,
      connection: "http://localhost:3500",
      options: {
        useConnectionNamespace: true,
        namespaceName: "API"
      }
    })
  )

  Vue.use(
    new VueSocketIO({
      debug: false,
      connection: "https://sfu.beta.playspace.tv",
      options: {
        useConnectionNamespace: true,
        namespaceName: "SFU"
      }
    })
  )
}
