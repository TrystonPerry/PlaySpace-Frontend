<template>
  <form @submit.prevent>
    <h1 class="text-3xl text-primary font-bold mb-2">Sign Up</h1>
    <p-input
      v-model="email"
      @blur="checkEmail"
      type="email"
      label="Email"
      required
    />
    <small v-if="errors.email" class="text-red-500">
      {{ errors.email }}
    </small>
    <div class="mb-2"></div>
    <p-input
      v-model="username"
      @blur="checkUsername"
      type="text"
      label="Username"
      required
    />
    <small v-if="errors.username" class="text-red-500">
      {{ errors.username }}
    </small>
    <div class="mb-2"></div>
    <p-input
      v-model="password"
      @blur="checkPassword"
      type="password"
      label="Password"
      required
    />
    <small v-if="errors.password" class="text-red-500">
      {{ errors.password }}
    </small>
    <div class="mb-2"></div>
    <p-input
      v-model="password2"
      @blur="checkPassword2"
      type="password"
      label="Repeat password"
      required
    />
    <small v-if="errors.password2" class="text-red-500">
      {{ errors.password2 }}
    </small>
    <div class="mb-2"></div>
    <p-btn
      @click="onSignup"
      type="submit"
      variant="primary"
      class="mt-4 w-full"
    >
      Sign Up
    </p-btn>
  </form>
</template>

<script>
import { mapActions } from "vuex"

import API from "@/api/api"

const regex = {
  email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  username: /^[a-zA-Z0-9]{3,24}$/,
  password: /^.{8,64}$/
}

export default {
  data: () => ({
    email: "",
    username: "",
    password: "",
    password2: "",
    errors: {
      email: "",
      username: "",
      password: "",
      password2: ""
    }
  }),

  methods: {
    ...mapActions({
      signup: "user/signup"
    }),

    async onSignup() {
      const email = await this.checkEmail()
      const username = await this.checkUsername()
      const password = this.checkPassword()
      const password2 = this.checkPassword2()

      if (email && username && password && password2) {
        const { success } = await this.signup({
          email: this.email,
          username: this.username,
          password: this.password
        })
        if (!success) return

        this.$emit("signup")
      }
    },

    async checkEmail() {
      if (this.email === "") {
        this.errors.email = "No email provided."
      } else if (!regex.email.test(this.email)) {
        this.errors.email = "Invalid email."
      } else {
        let { data, error } = await API.checkEmail(this.email)
        if (error) {
          this.errors.email = error
        } else {
          this.errors.email = ""
        }
      }
      return !this.errors.email
    },

    async checkUsername() {
      if (this.username === "") {
        this.errors.username = "No username provided."
      } else if (!regex.username.test(this.username)) {
        this.errors.username =
          "Usernames can only be 6-12 characters and contain alphanumeric characters."
      } else {
        let { data, error } = await API.checkUsername(this.username)
        if (error) {
          this.errors.username = error
        } else {
          this.errors.username = ""
        }
      }
      return !this.errors.username
    },

    checkPassword() {
      if (this.password === "") {
        this.errors.password = "No password provided."
      } else if (!regex.password.test(this.password)) {
        this.errors.password = "Passwords must be 8-64 characters long."
      } else {
        this.errors.password = ""
      }
      return !this.errors.password
    },

    checkPassword2() {
      if (this.password2 === "") {
        this.errors.password2 = "No password provided."
      } else if (this.password === "") {
        this.errors.password = "Please provide a password first."
      } else if (this.password2 !== this.password) {
        this.errors.password2 = "Passwords do not match."
      } else {
        this.errors.password2 = ""
      }
      return !this.errors.password2
    }
  }
}
</script>

<style></style>
