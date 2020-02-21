<template>
  <div>
    <div
      v-if="!$store.state.user.username"
      class="flex flex-wrap container mx-auto px-2 my-6"
    >
      <div class="w-full md:w-6/12 p-2 mb-6">
        <h1 class="text-4xl font-bold text-primary mb-2">
          Create a PlaySpace
        </h1>
        <h2 class="text-xl mb-2">
          Create a PlaySpace to share your gameplay, watch YouTube videos, and
          chat together.
        </h2>
        <h3 class="text-lg mb-3">
          You need to create an account or log in first.
        </h3>
        <div v-if="showSignup">
          <p class="mb-2">Already have an account with us?</p>
          <p-btn @click="showSignup = false" variant="primary-hover" size="sm">
            Log In Instead
          </p-btn>
        </div>
        <div v-else>
          <p class="mb-2">
            Don't have an account yet? You need one to create a PlaySpace
          </p>
          <p-btn @click="showSignup = true" variant="primary-hover" size="sm">
            Sign Up Instead
          </p-btn>
        </div>
      </div>
      <div class="w-full md:w-6/12 px-2">
        <p-card>
          <SignupForm v-if="showSignup" />
          <LoginForm v-else />
        </p-card>
      </div>
    </div>
    <div v-else>
      <div class="flex flex-wrap container mx-auto mt-6">
        <div class="w-full md:w-6/12 px-2 mb-6">
          <h1 class="text-4xl font-bold text-primary mb-2">
            Create a PlaySpace
          </h1>
          <h2 class="text-xl mb-4">
            Create a PlaySpace to share your gameplay, watch YouTube videos, and
            chat together.
          </h2>
          <img
            src="https://i.imgur.com/rVvXT9C.jpg"
            alt="PlaySpace UI mocukup"
            class="w-full px-2"
          />
        </div>
        <div class="w-full md:w-6/12 px-2 mb-6">
          <p-card>
            <PlaySpaceForm @create="onCreated" />
          </p-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SignupForm from "@/components/user/SignupForm"
import LoginForm from "@/components/user/LoginForm"
import PlaySpaceForm from "@/components/user/PlaySpaceForm"

export default {
  components: {
    SignupForm,
    LoginForm,
    PlaySpaceForm
  },

  data: () => ({
    showSignup: true
  }),

  methods: {
    onCreated(id) {
      this.$router.push({ path: `/p/${id}` })
    }
  }
}
</script>

<style>
</style>