<template>
  <div
    class="app-sidebar bg-dark-5 text-gray-300 h-full w-full max-w-64 min-w-64 shadow-reg"
  >
    <ul class="flex flex-col list-style-none h-full">
      <NavLink to="/live">
        <span>Live</span>
      </NavLink>
      <NavLink to="/categories">
        <span>Browse</span>
      </NavLink>
      <NavLink to="/">
        <span>About</span>
      </NavLink>
      <div class="flex-grow"></div>
      <ul class="list-none flex text-center px-1">
        <li class="px-1 py-2 w-6/12">
          <p-link to="/signup" variant="primary" size="sm" class="w-full">
            Sign Up
          </p-link>
        </li>
        <li class="px-1 py-2 w-6/12">
          <p-link to="/login" variant="primary-hover" size="sm" class="w-full">
            Log In
          </p-link>
        </li>
      </ul>
    </ul>
  </div>
</template>

<script>
import NavLink from "./NavLink"

export default {
  components: {
    NavLink
  }
}
</script>

<style lang="scss" scoped>
</style>