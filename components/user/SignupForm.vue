<template>
  <form @submit.prevent>
    <h1 class="text-3xl text-primary font-medium mb-2">Sign Up</h1>
    <p-input label="Email" type="email" required class="mb-2" />
    <label class="block text-lg mb-2">
      Username
      <input
        type="text"
        class="rounded text-xl border border-gray-400 h-10 py-2 px-3 w-full"
      />
    </label>
    <label class="block text-lg mb-2">
      Password
      <input
        type="text"
        class="rounded text-xl border border-gray-400 h-10 py-2 px-3 w-full"
      />
    </label>
    <label class="block text-lg mb-2">
      Password Again
      <input
        type="text"
        class="rounded text-xl border border-gray-400 h-10 py-2 px-3 w-full"
      />
    </label>
    <p-btn type="submit" variant="primary" class="mt-4 w-full">
      Sign Up
    </p-btn>
  </form>
</template>

<script>
export default {}
</script>

<style>
</style>