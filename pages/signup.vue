<template>
  <div class="login flex flex-wrap container mx-auto px-2 my-6">
    <div class="w-full md:w-6/12 p-2 mb-6">
      <h1 class="text-4xl font-bold text-primary mb-2">Sign Up</h1>
      <h2 class="text-xl mb-3">
        Sign up to create PlaySpaces, participate in chat, and claim your own
        username.
      </h2>
      <p-link to="/login" variant="primary-hover" size="sm">
        Log In Instead
      </p-link>
    </div>
    <div class="w-full md:w-6/12 p-2 pb-8">
      <p-card>
        <SignupForm @signup="$router.push({ path: '/live' })" />
      </p-card>
    </div>
  </div>
</template>

<script>
import SignupForm from "@/components/user/SignupForm"

export default {
  components: {
    SignupForm
  }
}
</script>

<style lang="scss" scoped>
.login {
  max-width: 64rem;
}
</style>