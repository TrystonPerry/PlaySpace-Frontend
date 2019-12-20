<template>
  <div>
    <div>
      <AppNavbar />
      <div class="h-12"></div>
      <div class="flex" style="overflow:hidden" :style="`height: ${screenHeight}`">
        <AppSidebar v-show="$store.state.nav.side.left.isShown" class="h-100 shadow-reg" />
        <div class="flex-grow overflow-y-auto h-100 bg-dark-1">
          <nuxt />
        </div>
        <PlaySpaceSidebar
          v-if="!$store.state.nav.isMobile"
          :key="$route.params.playspace"
          class="shadow-reg"
        />

        <notifications position="bottom left" class="fixed" style="z-index:1100" />
      </div>
    </div>

    <portal-target name="modal-container"></portal-target>
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
    // Fetch localStorage data for
    this.$store.dispatch("nav/loadFromLocalStorage")
    // Attempt to login with user token
    this.$store.dispatch("user/loginWithToken")
    // Add listener for updating screen height
    this.onResize()
    window.addEventListener("resize", this.onResize)
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.onResize)
  },

  methods: {
    onResize(e) {
      if (window.innerWidth < 768) {
        this.$store.dispatch("nav/setMobile", true)
      } else {
        this.$store.dispatch("nav/setMobile", false)
      }
      // Update screen height
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
