<template>
  <div class="flex flex-col min-h-screen bg-dark-1 text-gray-300">
    <LandingNavbar />
    <div class="h-12"></div>
    <nuxt class="flex-grow" />
    <LandingFooter />
  </div>
</template>

<script>
import layout from "@/mixins/layout"

import LandingNavbar from "@/components/navigation/LandingNavbar"
import LandingFooter from "@/components/navigation/LandingFooter"

export default {
  components: {
    LandingNavbar,
    LandingFooter
  },

  mixins: [layout],

  mounted() {
    this.$store.dispatch("user/loginWithToken")
  }
}
</script>

<style>
html {
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

body {
  background: #202020;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
</style>
