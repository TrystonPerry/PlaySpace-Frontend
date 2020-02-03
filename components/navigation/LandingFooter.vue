<template>
  <footer class="px-4 py-16 bg-dark-4 shadow">
    <div class="flex flex-wrap container mx-auto">
      <div class="md:w-6/12 p-4">
        <div class="font-bold">
          About
        </div>
        <span class="opacity-75">
          PlaySpace is a platform for sharing experiences with your friends and
          the world. It was started in 2019 and maintained soley by
          <a
            href="https://twitter.com/trystonperry"
            class="text-primary underline"
            target="_blank"
            >Tryston Perry</a
          >.
        </span>
      </div>
      <div class="md:w-6/12 flex">
        <div class="w-4/12 md:w-6/12 p-4">
          <div class="font-bold">
            Social
          </div>
          <ul class="flex flex-wrap">
            <li class="w-full md:w-6/12">
              <a
                href="https://twitter.com/playspacetv"
                class="opacity-75 hover:underline"
                target="_blank"
                >Twitter</a
              >
            </li>
            <li class="w-full md:w-6/12">
              <a
                href="http://discord.playspace.tv"
                class="opacity-75 hover:underline"
                target="_blank"
                >Discord</a
              >
            </li>
            <li class="w-full md:w-6/12">
              <a
                href="https://medium.com/@playspacetv"
                class="opacity-75 hover:underline"
                target="_blank"
                >Medium</a
              >
            </li>
            <li class="w-full md:w-6/12">
              <a
                href="http://youtube.playspace.tv"
                class="opacity-75 hover:underline"
                target="_blank"
                >YouTube</a
              >
            </li>
            <li class="w-full md:w-6/12">
              <a
                href="https://reddit.com/r/playspacetv"
                class="opacity-75 hover:underline"
                target="_blank"
                >Reddit</a
              >
            </li>
            <li class="w-full md:w-6/12">
              <a
                href="https://instagram.com/playspacetv"
                class="opacity-75 hover:underline"
                target="_blank"
                >Instagram</a
              >
            </li>
          </ul>
        </div>
        <div class="w-6/12 p-4">
          <div class="font-bold">
            Pages
          </div>
          <ul>
            <li>
              <nuxt-link to="/live" class="opacity-75 hover:underline">
                Live
              </nuxt-link>
            </li>
            <!-- <li>
              <nuxt-link to="/about" class="opacity-75 hover:underline">
                About
              </nuxt-link>
            </li> -->
            <li>
              <nuxt-link to="/create" class="opacity-75 hover:underline">
                Create a PlaySpace
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/signup" class="opacity-75 hover:underline">
                Sign Up
              </nuxt-link>
            </li>
            <li>
              <nuxt-link to="/login" class="opacity-75 hover:underline">
                Log In
              </nuxt-link>
            </li>
          </ul>
        </div>
        <!-- <div class="w-6/12 p-4">
          <div class="font-bold">
            Legal
          </div>
          <ul>
            <li>
              <a
                href="https://playspace.tv/pdfs/Terms%20Of%20Service.pdf"
                class="opacity-75 hover:underline"
                target="_blank"
                >Terms of Service</a
              >
            </li>
            <li>
              <a
                href="https://playspace.tv/pdfs/Privacy%20Policy.pdf"
                class="opacity-75 hover:underline"
                target="_blank"
                >Privacy Policy</a
              >
            </li>
          </ul>
        </div> -->
      </div>
    </div>
    <div class="text-center mt-4">
      Copyright © 2020 PlaySpace
    </div>
  </footer>
</template>

<script>
export default {}
</script>

<style></style>
