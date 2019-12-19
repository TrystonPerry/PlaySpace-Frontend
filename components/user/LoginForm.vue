<template>
  <form @submit.prevent>
    <h1 class="text-3xl text-primary font-bold mb-2">Log In</h1>
    <p-input
      v-if="!isTwoFA"
      v-model="username"
      type="text"
      label="Username or Email"
      required
      class="mb-2"
    />
    <p-input
      v-if="!isTwoFA"
      v-model="password"
      type="password"
      label="Password"
      required
      class="mb-2"
    />
    <p-input
      v-if="isTwoFA"
      v-model="code"
      type="text"
      label="Google Authenticator Code (2FA)"
      required
      class="mb-2"
    />
    <small v-if="error" class="text-red-500">{{ error }}</small>
    <p-btn
      v-if="!isTwoFA"
      @click="onLogin"
      type="submit"
      variant="primary"
      class="mt-4 w-full"
      >Log In</p-btn
    >
    <p-btn
      v-else
      @click="onTwoFALogin"
      type="submit"
      variant="primary"
      class="mt-4 w-full"
      >Log In</p-btn
    >
  </form>
</template>

<script>
import { mapActions } from "vuex"

import { required, requiredIf } from "vuelidate/lib/validators"

export default {
  data: () => ({
    username: "",
    password: "",
    code: "",
    isTwoFA: false,
    error: ""
  }),

  methods: {
    ...mapActions({
      login: "user/login",
      loginWith2FA: "user/loginWith2FA"
    }),

    async onLogin() {
      const { data, success, error } = await this.login({
        username: this.username,
        password: this.password
      })

      if (!success) {
        return (this.error = error)
      }

      this.error = ""

      if (data.isTwoFA) {
        return (this.isTwoFA = true)
      }

      this.$emit("login")
    },

    async onTwoFALogin() {
      const { data, success, error } = await this.onTwoFALogin({
        username: this.username,
        password: this.password,
        code: this.code
      })

      if (!success) {
        return (this.error = error)
      }

      this.error = ""

      this.$emit("login")
    }
  },

  validations: {
    username: {
      required
    },
    password: {
      required
    },
    code: {
      required: requiredIf(function() {
        return this.isTwoFA
      })
    }
  }
}
</script>

<style></style>
