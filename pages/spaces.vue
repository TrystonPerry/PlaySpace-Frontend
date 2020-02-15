<template>
  <div class="mt-2 mb-6">
    <h1 class="text-3xl text-primary text-center font-bold mt-6 mb-2">
      My PlaySpaces
    </h1>
    <MyPlaySpaces />
    <div class="text-center my-12">
      <h2 class="text-lg mb-3 mx-auto" style="max-width:450px;">
        Create a PlaySpace to watch your favorite videos, games, and more;
        together!
      </h2>
      <p-link variant="primary" to="/create">
        Create my PlaySpace
      </p-link>
    </div>
  </div>
</template>

<script>
import MyPlaySpaces from "@/components/playspaces/MyPlaySpaces"

export default {
  components: {
    MyPlaySpaces
  }
}
</script>

<style>
</style>