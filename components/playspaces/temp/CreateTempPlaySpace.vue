<template>
  <p-btn @click="createTempPlaySpace" variant="primary">Create a PlaySpace</p-btn>
</template>

<script>
import API from "@/api/api"

export default {
  methods: {
    async createTempPlaySpace() {
      const id = Math.random()
        .toString(36)
        .substr(2, 9)

      this.$router.push({ path: `/p/temp/${id}` })
    }
  }
}
</script>

<style>
</style>