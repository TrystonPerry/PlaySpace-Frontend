<template>
  <p-btn
    @click="createTempPlaySpace"
    variant="primary"
  >
    Create a PlaySpace
  </p-btn>
</template>

<script>
import API from "@/api/api"

export default {
  methods: {
    async createTempPlaySpace() {
      const { data, success } = await API.temp.createChannel();

      if (!success) return

      this.$router.push({ path: `/p/temp/${data.id}` })
    }
  }
}
</script>

<style>

</style>