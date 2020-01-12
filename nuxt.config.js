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
          "Watch your favorite content together with your friends all from the click of a few buttons. No software, no hastle, no BS."
      },
      {
        hid: "og:image",
        property: "og:image",
        content: "https://i.imgur.com/t2wBi3E.png"
      },
      {
        hid: "twitter:image",
        property: "twitter:image",
        content: "https://i.imgur.com/t2wBi3E.png"
      },
      {
        hid: "og:type",
        property: "og:type",
        content: "website"
      },
      {
        hid: "twitter-card",
        property: "twitter:card",
        content: "summary_large_image"
      }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
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
  css: ["~/assets/tailwind.css", "~/assets/main.css"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "~/plugins/plugins.js",
    "~/plugins/socket.js",
    "~/plugins/globals.js",
    "~/plugins/filters.js",
    { src: "~/plugins/plugins-no-ssr.js", ssr: false }
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
