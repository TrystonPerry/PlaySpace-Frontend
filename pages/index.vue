<template>
  <div class="landing container px-2 mx-auto mt-4">
    <div class="flex flex-wrap items-center">
      <div class="w-full sm:w-6/12 text-center sm:text-left">
        <h1 class="text-4xl md:text-5xl font-bold text-primary">PlaySpace</h1>
        <h2 class="sm:text-lg mb-3">
          Watch your favorite content together with your friends all from the click of a few
          buttons. No software, no hastle, no BS.
        </h2>
        <div class="mb-2">
          <p-link to="/live" variant="primary">Join a PlaySpace</p-link>
          <p-link to="/signup" variant="primary-outline">Create a PlaySpace</p-link>
        </div>
        <ul
          class="flex justify-center md:justify-start social-media list-style-none pl-0 text-primary"
          aria-label="PlaySpace's Social Media"
        >
          <li class="mr-2">
            <a href="https://twitter.com/playspacetv" target="_blank">
              <p-icon icon="fab fa-twitter" screen-reader-text="PlaySpace Twitter" />
            </a>
          </li>
          <li class="mr-2">
            <a href="https://discord.gg/WwewP4D" target="_blank">
              <p-icon icon="fab fa-discord" screen-reader-text="PlaySpace Discord" />
            </a>
          </li>
          <li class="mr-2">
            <a href="https://medium.com/@playspacetv" target="_blank">
              <p-icon icon="fab fa-medium" screen-reader-text="PlaySpace Medium" />
            </a>
          </li>
          <li class="mr-2">
            <a href="https://www.youtube.com/channel/UC7Uqb7o-sthQtJLarbBGIcg" target="_blank">
              <p-icon icon="fab fa-youtube" screen-reader-text="PlaySpace YouTube" />
            </a>
          </li>
          <li class="mr-2">
            <a href="https://reddit.com/r/playspacetv" target="_blank">
              <p-icon icon="fab fa-reddit" screen-reader-text="PlaySpace Reddit" />
            </a>
          </li>
          <li class="mr-2">
            <a href="https://instagram.com/playspacetv" target="_blank">
              <p-icon icon="fab fa-instagram" screen-reader-text="PlaySpace Instagram" />
            </a>
          </li>
        </ul>
      </div>
      <div class="w-full sm:w-6/12">
        <img
          src="https://previews.123rf.com/images/fad82/fad821804/fad82180400028/100256066-modern-digital-devices-with-transparent-screen-isolated-on-white-background-vector-illustration-.jpg"
          alt
          class="w-100"
        />
      </div>
    </div>

    <ul class="row p-0 mt-5 list-style-none">
      <li class="col-xs-12 col-sm-4 mb-4 mb-md-0">
        <div class="card h-100 p-0">
          <img
            src="https://media.playstation.com/is/image/SCEA/the-jackbox-party-pack-2-screenshot-09-ps3-us-25sept15?$MediaCarousel_Original$"
            alt
            class="w-100"
          />
          <div class="p-3">
            <div class="card-icon font-lg mb-3">
              <i class="fa fa-gamepad mr-2"></i>
              <h4 class="font-md m-0">Games</h4>
            </div>
            <p class="m-0">
              Share your gameplay with your friends in real-time. Play cooperative games like
              Jackbox Party Pack, let them watch you beat a difficult boss, or share strategies in
              competitive games.
            </p>
          </div>
        </div>
      </li>
      <li class="col-xs-12 col-sm-4 mb-4 mb-md-0">
        <div class="card h-100 p-0">
          <img
            src="https://media.playstation.com/is/image/SCEA/the-jackbox-party-pack-2-screenshot-09-ps3-us-25sept15?$MediaCarousel_Original$"
            alt
            class="w-100"
          />
          <div class="p-3">
            <div class="card-icon font-lg mb-3">
              <i class="fab fa-youtube mr-2"></i>
              <h4 class="font-md m-0">Videos</h4>
            </div>
            <p class="m-0">
              PlaySpace is great for watching YouTube with friends. With our dedicated video player,
              anyone can add videos to a queue and vote on the ones they want to see.
            </p>
          </div>
        </div>
      </li>
      <li class="col-xs-12 col-sm-4 mb-4 mb-md-0">
        <div class="card h-100 p-0">
          <img
            src="https://media.playstation.com/is/image/SCEA/the-jackbox-party-pack-2-screenshot-09-ps3-us-25sept15?$MediaCarousel_Original$"
            alt
            class="w-100"
          />
          <div class="p-3">
            <div class="card-icon font-lg mb-3">
              <i class="fa fa-music mr-2"></i>
              <h4 class="font-md m-0">Music</h4>
            </div>
            <p class="m-0">
              Get closer with your friends across the globe by sharing your music tastes. If they
              don’t like your music, ban them from your chat :)
            </p>
          </div>
        </div>
      </li>
    </ul>

    <div class="fav-content">
      <h1
        class="container-sm font-xl m-0 mb-4"
      >Your favorite content was meant to be watched together.</h1>
    </div>

    <div class="container container-sm mt-5 text-center">
      <h1 class="font-lg mb-3">Browser Support</h1>
      <div class="mb-4">
        <h2 class="font-md mt-0 font-weight-normal">
          We rely on a web browser technology called WebRTC, its support can sometimes be spotty. It
          appears that your web browser does not support all the needed requirements.
          <strong>We recommend using Google Chrome.</strong>
        </h2>
        <a
          href="https://www.google.com/chrome/"
          target="_blank"
          class="btn btn-main"
        >Download Chrome</a>
      </div>
      <div class="supported row">
        <div class="col-xs-12 col-sm-6">
          <ul class="card h-100 my-0">
            <h3 class="my-0">Watching</h3>
            <hr />
            <li class="supported-item mb-1">
              <div class="font-md">
                <i class="fa fa-check mr-2" aria-hidden></i>
              </div>
              <span class="font-weight-bold">You can watch!</span>
            </li>
          </ul>
        </div>
        <div class="col-xs-12 col-sm-6">
          <div class="card h-100">
            <h3 class="my-0">Streaming</h3>
            <hr />
            <div class="supported-item mb-1 supported-item--false">
              <div class="font-md">
                <i class="fa fa-check mr-2" aria-hidden></i>
              </div>
              <span class="font-weight-bold">You can't stream video.</span>
            </div>
            <div class="supported-item mb-1 supported-item--false">
              <div class="font-md">
                <i class="fa fa-check mr-2" aria-hidden></i>
              </div>
              <span class="font-weight-bold">You can't stream audio.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
.landing {
  .hero {
    align-items: center;

    h2,
    h3 {
      font-weight: normal;
    }

    .social-media {
      display: flex;
    }
  }

  .card {
    &-icon {
      display: flex;
      align-items: center;
      color: #009dee;
    }

    img {
      border-radius: 4px 4px 0 0;
    }
  }

  .fav-content {
    margin: 5rem 0;
  }

  .supported {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    &-item {
      display: flex;
      align-items: center;
      align-content: center;
      background: #34e334;
      border: 4px solid #45c920;
      border-radius: 4px;
      color: white;
      padding: 0.5rem 1rem;

      &--false {
        background: #ff1f1f;
        border: 4px solid #d11919;
      }
    }
  }
}
</style>