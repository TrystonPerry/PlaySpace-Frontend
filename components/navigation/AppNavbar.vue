<template>
  <div class="flex justify-between w-full h-12 bg-primary text-white shadow-md">
    <ul class="list-none flex items-center">
      <button class="w-12 h-12">
        <p-icon icon="fas fa-bars" screen-reader-text="Menu" size="lg" />
      </button>
      <NavLink to="/live" class="font-bold">
        <img src="/img/playspace-icon-trans.png" alt="PlaySpace logo" class="h-full" />
        <span>PlaySpace</span>
      </NavLink>
      <NavLink to="/categories" class="hidden sm:block">
        <span>Browse</span>
      </NavLink>
      <NavLink to="/" class="hidden sm:block">
        <span>About</span>
      </NavLink>
    </ul>
    <ul class="list-none flex items-center">
      <li class="hidden sm:block px-1 py-2">
        <p-link to="/login" variant="white-outline" size="sm">Log In</p-link>
      </li>
      <li class="px-1 py-2">
        <p-link to="/signup" variant="white" size="sm">Sign Up</p-link>
      </li>
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

<style>
</style>