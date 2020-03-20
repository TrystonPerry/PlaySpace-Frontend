<template>
  <div>
    <h1 class="text-2xl font-bold text-center mb-3">Share on Social</h1>
    <ul class="socials list-style-none flex flex-wrap justify-center items-center">
      <li>
        <p-btn
          @click="
            openUrl(
              `https://twitter.com/intent/tweet/?text=${text}.&amp;url=${url}`
            )
          "
          variant="primary"
          size="sm"
        >
          <p-icon icon="fab fa-twitter" />Share on Twitter
        </p-btn>
      </li>
      <li>
        <p-btn
          @click="openUrl(`https://facebook.com/sharer/sharer.php?u=${url}`)"
          variant="primary"
          size="sm"
        >
          <p-icon icon="fab fa-facebook" />Share on Facebook
        </p-btn>
      </li>
      <li>
        <p-btn @click="openEmail" variant="primary" size="sm">
          <p-icon icon="fas fa-envelope" />Share via Email
        </p-btn>
      </li>
      <li>
        <p-copy :text="url" variant="primary" size="sm">
          <p-icon icon="fas fa-link" />Copy Link
        </p-copy>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    text() {
      const { fullUsername } = this.$store.state.user
      let text = "Come watch our PlaySpace!"
      if (fullUsername) {
        text = `Come watch ${fullUsername} stream on PlaySpace!`
      }
      return encodeURI(text)
    },

    url() {
      if (!process.client) return ""
      return location.origin + this.$route.fullPath
    }
  },

  methods: {
    openUrl(url) {
      window.open(url, "", "height=700,width=500,modal=yes,alwaysRaised=yes")
    },

    openEmail() {
      window.open(
        `mailto:?subject=${this.text}.%20No%20JavaScript.%20No%20tracking.&amp;body=Check%20out%20my%20PlaySpace!%20${this.url}`
      )
    }
  }
}
</script>

<style lang="scss">
.socials > li {
  margin: 0.25rem;
}
</style>