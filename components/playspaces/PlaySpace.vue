<template>
  <div class="playspace relative rounded-lg bg-gray-200">
    <router-link :to="`/${stream.username}`">
      <small class="absolute bg-primary text-white rounded-lg m-2 py-1 px-2 uppercase">live</small>
      <div class="w-full h-48 overflow-hidden rounded-t-lg">
        <img :src="stream.screenshot.url" class="w-full h-full object-cover" />
      </div>
      <div class="relative p-3">
        <span class="playspace__viewcount absolute bg-white rounded-full py-2 px-4 shadow-reg">
          <i class="fa fa-user"></i>
          {{ stream.viewerCount }} viewers
        </span>
        <div class="mt-4">
          <h2 class="font-bold mb-1">{{ stream.title }}</h2>
          <h3 class="mb-1">
            <p-avatar :src="stream.avatar" :alt="stream.username" size="sm" />
            {{ stream.username }}
          </h3>
          <nuxt-link to="/games">
            <small class="mr-2 bg-green-500 text-white rounded py-1 px-2" title="Category">
              <i class="fa fa-gamepad"></i>
              Game
            </small>
          </nuxt-link>
          <nuxt-link v-if="stream.game" :to="`/games/${stream.game}`">
            <small title="Game">
              <i class="fa fa-gamepad"></i>
              {{ stream.game }}
            </small>
          </nuxt-link>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    stream: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss">
.playspace {
  &__viewcount {
    top: -1rem;
  }
}

// .stream {
//   display: flex;
//   position: relative;
//   border-radius: 10px;

//   &__status {
//     position: absolute;
//     border-radius: 4px;
//     padding: 5px;
//     top: 10px;
//     left: 10px;
//     font-size: 12px;
//     background: red;
//     color: white;
//   }

//   &__screenshot {
//     border-radius: 10px 10px 0 0;
//     width: 100%;
//     min-height: 150px;
//     height: 150px;
//     overflow: hidden;

//     img {
//       object-fit: cover;
//       height: 100%;
//       width: 100%;
//       transition-duration: 200ms;
//       transition-timing-function: ease-in-out;
//     }
//   }

//   &__info {
//     padding: 10px;
//     position: relative;
//   }

//   &__title {
//     font-size: 20px;
//     word-wrap: break-word;
//   }

//   &__viewers {
//     position: absolute;
//     top: -20px;
//     background: white;
//     border-radius: 25px;
//     padding: 10px;
//     box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.1);
//   }

//   &__link {
//     color: #232323;
//     background: rgb(240, 238, 238);
//     border-radius: 10px;
//     text-decoration: none;
//     box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.1);
//     transition-duration: 200ms;
//     width: 100%;

//     &:hover,
//     &:focus {
//       transform: scale(1.02);
//       box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.15);
//     }
//   }

//   &__username {
//     font-size: 20px;
//     display: flex;
//     margin-bottom: 10px;

//     img {
//       margin-right: 0.5rem;
//     }
//   }

//   &__game,
//   &__uptime {
//     display: inline-block;
//     margin: 0 5px;
//   }
// }
//
</style>