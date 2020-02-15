import { mapState, mapActions } from "vuex"

import API from "@/api/api"

export default {
  mounted() {
    this.checkIfLoggedIn()
  },

  computed: {
    ...mapState({
      myPlaySpaces: state => state.playSpace.my
    }),

    isLoggedIn() {
      return !!this.$store.state.user.username
    }
  },

  watch: {
    isLoggedIn() {
      this.checkIfLoggedIn()
    }
  },

  methods: {
    ...mapActions({
      setMyPlaySpaces: "playSpace/setMyPlaySpaces",
      removeOneOfMyPlaySpaces: "playSpace/removeOneOfMyPlaySpaces"
    }),

    async checkIfLoggedIn() {
      if (this.isLoggedIn) {
        if (!this.myPlaySpaces.length) {
          const { data, success } = await API.getUsersPlaySpaces()
          if (!success) return

          this.setMyPlaySpaces(data)
          data.forEach((playSpace, i) => {
            this.sockets.API.subscribe(`room-deleted-${playSpace.id}`, () => {
              this.removeOneOfMyPlaySpaces(playSpace)
            })
          })
        }
        return
      }
      this.setMyPlaySpaces([])
    }
  }
}
