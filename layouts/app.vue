<template>
  <div>
    <div>
      <LandingNavbar />
      <div class="h-12"></div>
      <div
        class="flex"
        style="overflow:hidden"
        :style="`height: ${screenHeight}`"
      >
        <div class="flex-grow overflow-y-auto h-100 bg-dark-1">
          <nuxt />
        </div>
        <PlaySpaceSidebar
          v-if="!$store.state.nav.isMobile"
          :key="$route.params.playspace"
          class="shadow-reg"
        />

        <notifications
          position="bottom left"
          class="fixed"
          style="z-index:1100"
        />
      </div>
    </div>

    <portal-target name="modal-container"></portal-target>

    <!-- Show share current page modal -->
    <p-modal :value="modal === 'share'" @input="closeModal">
      <p-share />
    </p-modal>

    <!-- Show edit ranks of playspace modal -->
    <p-modal :value="modal === 'users'" @input="closeModal">
      <EditPlaySpaceUsers />
    </p-modal>

    <!-- Edit playspace settings modal -->
    <p-modal :value="modal === 'settings'" @input="closeModal">
      <EditPlaySpace @edit="closeModal" />
    </p-modal>
  </div>
</template>

<script>
import { mapState } from "vuex"

import layout from "@/mixins/layout"

import LandingNavbar from "@/components/navigation/LandingNavbar"
import LandingSidebar from "@/components/navigation/LandingSidebar"
import PlaySpaceSidebar from "@/components/navigation/PlaySpaceSidebar"
import EditPlaySpaceUsers from "@/components/playspaces/edit/EditPlaySpaceUsers"
import EditPlaySpace from "@/components/playspaces/EditPlaySpace"

export default {
  components: {
    LandingNavbar,
    LandingSidebar,
    PlaySpaceSidebar,
    EditPlaySpace,
    EditPlaySpaceUsers
  },

  mixins: [layout],

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

  computed: {
    ...mapState({
      modal: state => state.nav.modal
    })
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
    },

    closeModal(value) {
      this.$store.dispatch("nav/setModal", "")
    }
  }
}
</script>

<style scoped lang="scss">
body {
  overflow: hidden;
  background: #202020;
}
</style>
