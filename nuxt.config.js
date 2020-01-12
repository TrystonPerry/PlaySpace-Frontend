const path = require("path")
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

module.exports = {
  server: {
    port: process.env.PORT, // default 8000
    host: process.env.HOST || "localhost"
  },
  mode: "universal",
  /*
   ** Headers of the page
   */
  head: {
    title: "PlaySpace",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content:
          "Stream games, watch videos and chat with friends. All from your web browser, no software needed."
      },
      {
        hid: "og:image",
        property: "og:image",
        content:
          "https://upload.wikimedia.org/wikipedia/commons/6/67/Hoffl%C3%B6th%28T%C3%B6Vo-Cl%C3%B6rath%29-2%28400x400%29.jpg"
      },
      {
        hid: "twitter:image",
        property: "twitter:image",
        content:
          "https://upload.wikimedia.org/wikipedia/commons/6/67/Hoffl%C3%B6th%28T%C3%B6Vo-Cl%C3%B6rath%29-2%28400x400%29.jpg"
      },
      {
        hid: "og:type",
        property: "og:type",
        content: "website"
      }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href: "/main.css"
      },
      {
        type: "stylesheet",
        href: "https://fonts.googleapis.com/css?family=Source+Sans+Pro"
      }
    ],
    script: [
      {
        src: "https://kit.fontawesome.com/af0f8191a0.js",
        crossorigin: "anonymous"
      },
      {
        src: "https://www.youtube.com/iframe_api"
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: ["~/assets/tailwind.css"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "~/plugins/plugins.js",
    "~/plugins/socket.js",
    "~/plugins/globals.js",
    "~/plugins/filters.js",
    { src: "~/plugins/plugins-no-ssr.js", ssr: false },
    { src: "~/plugins/ga.js", mode: "client" }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ["@nuxtjs/dotenv"],
  /*
   ** Nuxt.js environment variables
   */
  dotenv: {
    apiUrl: process.env.API_URL,
    sfuUrl: process.env.SFU_URL
  },
  /*
   ** Nuxt.js modules
   */
  modules: ["nuxt-purgecss"],
  serverMiddleware: ["redirect-ssl"],
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    postcss: {
      plugins: {
        tailwindcss: path.resolve(__dirname, "./tailwind.config.js")
      }
    },

    extractCSS: true,

    extend(config, ctx) {}
  }
}
