<template>
  <form @submit.prevent="onSignup">
    <h1 class="text-3xl text-primary font-medium mb-2">Sign Up</h1>
    <p-input label="Email" type="email" required class="mb-2" />
    <label class="block text-lg mb-2">
      Username
      <p-input type="text" />
    </label>
    <label class="block text-lg mb-2">
      Password
      <p-input type="text" />
    </label>
    <label class="block text-lg mb-2">
      Password Again
      <p-input type="text" />
    </label>
    <p-btn type="submit" variant="primary" class="mt-4 w-full">
      Sign Up
    </p-btn>
  </form>
</template>

<script>
export default {}
</script>

<style></style>
