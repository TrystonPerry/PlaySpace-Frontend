<template>
  <div class="landing container px-2 mx-auto mt-4">
    <div class="flex flex-wrap items-center">
      <div class="w-full md:w-6/12 text-center md:text-left">
        <h1 class="text-5xl font-medium text-primary">PlaySpace</h1>
        <h2 class="text-xl mt-1 mb-4">
          Watch videos, play games, or browse the internet with your friends.
          All from your web browser, no software needed.
        </h2>
        <div class="mb-2">
          <p-link to="/live" variant="primary" class="mr-2 mb-2 text-center">
            Join a PlaySpace
          </p-link>
          <p-link to="/signup" variant="primary-outline" class="text-center">
            Create a PlaySpace
          </p-link>
        </div>
        <ul
          class="flex justify-center md:justify-start social-media list-style-none pl-0 text-primary"
          aria-label="PlaySpace's Social Media"
        >
          <li class="mr-2">
            <a href="https://twitter.com/playspacetv" target="_blank">
              <p-icon
                icon="fab fa-twitter"
                screen-reader-text="PlaySpace Twitter"
              />
            </a>
          </li>
          <li class="mr-2">
            <a href="https://discord.gg/WwewP4D" target="_blank">
              <p-icon
                icon="fab fa-discord"
                screen-reader-text="PlaySpace Discord"
              />
            </a>
          </li>
          <li class="mr-2">
            <a href="https://medium.com/@playspacetv" target="_blank">
              <p-icon
                icon="fab fa-medium"
                screen-reader-text="PlaySpace Medium"
              />
            </a>
          </li>
          <li class="mr-2">
            <a
              href="https://www.youtube.com/channel/UC7Uqb7o-sthQtJLarbBGIcg"
              target="_blank"
            >
              <p-icon
                icon="fab fa-youtube"
                screen-reader-text="PlaySpace YouTube"
              />
            </a>
          </li>
          <li class="mr-2">
            <a href="https://reddit.com/r/playspacetv" target="_blank">
              <p-icon
                icon="fab fa-reddit"
                screen-reader-text="PlaySpace Reddit"
              />
            </a>
          </li>
          <li class="mr-2">
            <a href="https://instagram.com/playspacetv" target="_blank">
              <p-icon
                icon="fab fa-instagram"
                screen-reader-text="PlaySpace Instagram"
              />
            </a>
          </li>
        </ul>
      </div>
      <div class="w-full md:w-6/12">
        <img src="https://i.imgur.com/NVAaY3Q.png" class="w-100" />
      </div>
    </div>

    <!-- What is a PlaySpace? -->
    <div class="container text-center my-6 py-6 mx-auto">
      <h1 class="text-3xl font-medium text-primary">What is a PlaySpace?</h1>
      <h2 class="text-2xl md:w-6/12 mx-auto">
        A PlaySpace is a virtual room you can create to easily share gameplay,
        videos or browse the internet with friends.
      </h2>
      <div class="flex flex-wrap mx-auto -px-2 md:w-9/12">
        <div class="w-full md:w-6/12 p-2">
          <h2 class="text-2xl text-primary">Public PlaySpaces</h2>
          <h3 class="text-left font-weight-normal">
            Public PlaySpaces are rooms for streaming yourself to anyone on the
            intertnet. It's much like streaming on Twitch or Youtube.
          </h3>
        </div>
        <div class="w-full md:w-6/12 p-2">
          <h2 class="text-2xl text-primary">Private PlaySpaces</h2>
          <h3 class="text-left font-weight-normal">
            Private PlaySpaces are private rooms only accessible to those with
            an invite link. They are intended to be used when you want to watch
            content with only people you know.
          </h3>
        </div>
      </div>
    </div>

    <!-- Use Cases -->
    <div class="container mt-5">
      <h1 class="text-3xl font-medium text-primary">Use Cases</h1>
      <p>What is PlaySpace great for?</p>
      <div class="flex flex-wrap -mx-2">
        <div class="w-full sm:w-6/12 md:w-3/12 p-2">
          <ul class="list-style-none pl-0">
            <li v-for="(useCase, i) in useCases" :key="i">
              <p-btn
                @click="curUseCase = i"
                :variant="curUseCase === i ? 'primary' : 'primary-outline'"
                class="mb-2 w-full sm:text-left"
              >
                {{ useCase.title }}
              </p-btn>
            </li>
          </ul>
        </div>
        <div class="w-full sm:w-6/12 md:w-9/12 p-2">
          <ul class="list-style-none pl-0">
            <li v-for="(useCase, i) in useCases" :key="i">
              <div v-show="curUseCase === i">
                <h2 class="font-bold mb-1 text-primary">
                  {{ useCase.title }}
                </h2>
                <h3 class="text-3xl leading-tight">
                  {{ useCase.desc }}
                </h3>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Quote Statement -->
    <div class="fav-content">
      <h1 class="container-sm text-5xl font-medium mb-4">
        Your favorite content was meant to be watched together.
      </h1>
    </div>

    <!-- Browser Support -->
    <div class="container container-sm mt-5 text-center">
      <h1 class="font-lg mb-3">Browser Support</h1>
      <div class="mb-4">
        <h2 class="font-md mt-0 font-weight-normal">
          We rely on a web browser technology called WebRTC, its support can
          sometimes be spotty. It appears that your web browser does not support
          all the needed requirements.
          <strong>We recommend using Google Chrome.</strong>
        </h2>
        <a
          href="https://www.google.com/chrome/"
          target="_blank"
          class="btn btn-main"
          >Download Chrome</a
        >
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
export default {
  data: () => ({
    curUseCase: 0,
    useCases: [
      {
        title: "Play Cooperative Games",
        desc:
          "Want to play games like Jackbox Party Pack with your friends in real-time? Public PlaySpaces are a great place for it!"
      },
      {
        title: "Live Q&A",
        desc:
          "Want to host a live Q&A, AMA or Podcast? PlaySpace is a great place to do that. With sub-second delay, you can have a real conversation compared to Twitch and YouTube Live."
      },
      {
        title: "Long Distance Relationships",
        desc:
          "Do you and your special other live apart from each other? PlaySpace’s Private rooms are a great way to spend time together YouTube or browsing the internet together."
      },
      {
        title: "Live Game Show",
        desc:
          "Want to host a competition with friends or random internet people? PlaySpace is great for that! For example, we have a monthly event where users post their best memes and they vote on who has the funniest ones."
      },
      {
        title: "Live Coding Session",
        desc:
          "Are you a developer who wants to share their code with the world and help teach people concepts or just have fun building things? PlaySpace is the best way to do that! With sub-second delay, it makes online teaching & cooperation easier."
      }
    ],
    pros: [
      "Sub-second video streaming",
      "Web Browser-based, no software required",
      "Stream with the click of a few buttons",
      "Consume all web-based content in a single place."
    ],
    cons: [
      "Lower video quality than Twitch and YouTube Live",
      "With low latency, stream snipers could be a problem",
      "It’s still a Beta run by 1 person :P"
    ]
  })
}
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