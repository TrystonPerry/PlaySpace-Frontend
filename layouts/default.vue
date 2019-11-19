<template>
  <div class="bg-dark-1 text-gray-300">
    <LandingNavbar />
    <div class="h-12"></div>
    <nuxt />
  </div>
</template>

<script>
import LandingNavbar from "@/components/navigation/LandingNavbar"

export default {
  components: {
    LandingNavbar
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

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
</style>
