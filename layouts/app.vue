<template>
  <div>
    <AppNavbar />
    <div class="h-12"></div>
    <div
      class="flex"
      style="overflow:hidden"
      :style="`height: ${screenHeight}`"
    >
      <AppSidebar
        v-show="$store.state.nav.side.left.isShown"
        class="h-100 shadow-reg"
      />
      <div class="flex-grow overflow-y-auto p-2 h-100 bg-dark-1">
        <nuxt />
      </div>
      <PlaySpaceSidebar :key="$route.params.playspace" class="shadow-reg" />
    </div>
  </div>
</template>

<script>
import AppNavbar from "@/components/navigation/AppNavbar"
import AppSidebar from "@/components/navigation/AppSidebar"
import PlaySpaceSidebar from "@/components/navigation/PlaySpaceSidebar"

export default {
  components: {
    AppNavbar,
    AppSidebar,
    PlaySpaceSidebar
  },

  data: () => ({
    screenHeight: "0px"
  }),

  mounted() {
    this.$store.dispatch("user/loginWithToken")
    this.updateScreenHeight()
    window.addEventListener("resize", this.updateScreenHeight)
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.updateScreenHeight)
  },

  methods: {
    updateScreenHeight() {
      this.screenHeight = window.innerHeight - 48 + "px"
    }
  }
}
</script>

<style scoped>
body {
  overflow: hidden;
  background: #202020;
}
</style>
