<template>
  <form>
    <h1 class="text-3xl text-primary font-medium mb-2">Log In</h1>
    <p-input
      v-if="!isTwoFA"
      v-model="username"
      type="text"
      label="Username or Email"
      required
      :invalid="$v.username.$dirty"
      class="mb-2"
    />
    <p-input
      v-if="!isTwoFA"
      v-model="password"
      type="text"
      label="Password"
      required
      :invalid="$v.password.$dirty"
      class="mb-2"
    />
    <p-input
      v-if="isTwoFA"
      v-model="code"
      type="text"
      label="Google Authenticator Code (2FA)"
      required
      :invalid="$v.code.$dirty"
      class="mb-2"
    />
    <p-btn @click="onLogin" type="submit" variant="primary" class="mt-4 w-full">
      Log In
    </p-btn>
  </form>
</template>

<script>
import { required, requiredIf } from "vuelidate/lib/validators"

export default {
  data: () => ({
    username: "",
    password: "",
    code: "",
    isTwoFA: false
  }),

  methods: {
    onLogin() {
      this.$v.$touch()
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
