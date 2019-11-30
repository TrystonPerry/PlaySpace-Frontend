<template>
  <div class="login flex flex-wrap container mx-auto px-2 mt-6">
    <div class="w-full md:w-6/12 p-2 mb-6">
      <h1 class="text-4xl font-medium text-primary mb-2">Log In</h1>
      <h2 class="text-xl mb-3">Log back in to your existing PlaySpace account.</h2>
      <p-link to="/signup" variant="primary-hover" size="sm">Sign Up Instead</p-link>
    </div>
    <div class="w-full md:w-6/12 p-2">
      <p-card>
        <LoginForm @login="$router.push({ path: '/live' })" />
      </p-card>
    </div>
  </div>
</template>

<script>
import LoginForm from "@/components/user/LoginForm"

export default {
  components: {
    LoginForm
  }
}
</script>

<style lang="scss" scoped>
.login {
  max-width: 64rem;
}
</style>