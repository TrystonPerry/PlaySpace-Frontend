<template>
  <div class="landing pt-6 text-gray-400 overflow-x-hidden">
    <!-- Hero -->
    <div
      class="container lg:flex items-center mx-auto px-2 pt-6 lg:min-h-screen-75"
    >
      <div class="mb-8 lg:w-5/12">
        <div class="w-full text-center lg:text-left">
          <h1
            class="text-3xl md:text-5xl font-bold text-gray-300 leading-none mb-3"
          >
            Watch anything with anyone.
          </h1>
          <div class="mx-auto lg:mx-0 max-w-96">
            <p class="text-gray-400 md:text-lg mt-1 mb-4">
              Create an online room to stream games, watch videos, and chat with
              friends. No downloads required. Just have fun.
            </p>
          </div>
          <div class="mb-2">
            <p-link
              to="/create"
              variant="primary"
              class="mr-2 mb-2 text-center"
            >
              Create a PlaySpace
            </p-link>
          </div>
          <ul
            class="flex justify-center lg:justify-start social-media list-style-none pl-0 text-gray-400"
            aria-label="PlaySpace's Social Media"
          >
            <li class="mr-2">
              <a
                href="https://twitter.com/playspacetv"
                target="_blank"
                class="text-primary"
              >
                <p-icon
                  icon="fab fa-twitter"
                  screen-reader-text="PlaySpace Twitter"
                />
              </a>
            </li>
            <li class="mr-2">
              <a
                href="https://discord.gg/WwewP4D"
                target="_blank"
                class="text-primary"
              >
                <p-icon
                  icon="fab fa-discord"
                  screen-reader-text="PlaySpace Discord"
                />
              </a>
            </li>
            <li class="mr-2">
              <a
                href="https://medium.com/@playspacetv"
                target="_blank"
                class="text-primary"
              >
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
                class="text-primary"
              >
                <p-icon
                  icon="fab fa-youtube"
                  screen-reader-text="PlaySpace YouTube"
                />
              </a>
            </li>
            <li class="mr-2">
              <a
                href="https://reddit.com/r/playspacetv"
                target="_blank"
                class="text-primary"
              >
                <p-icon
                  icon="fab fa-reddit"
                  screen-reader-text="PlaySpace Reddit"
                />
              </a>
            </li>
            <li class="mr-2">
              <a
                href="https://instagram.com/playspacetv"
                target="_blank"
                class="text-primary"
              >
                <p-icon
                  icon="fab fa-instagram"
                  screen-reader-text="PlaySpace Instagram"
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="lg:ml-8 lg:w-7/12">
        <div
          style="width:100%;height:0px;position:relative;padding-bottom:56.250%;"
        >
          <iframe
            src="https://streamable.com/s/zgbow/moiyfr"
            frameborder="0"
            width="100%"
            height="100%"
            allowfullscreen
            style="width:100%;height:100%;position:absolute;left:0px;top:0px;overflow:hidden;"
          ></iframe>
        </div>
      </div>
    </div>

    <!-- Features -->
    <div class="py-12 my-8 rounded bg-dark-2 px-2">
      <h2 class="text-2xl md:text-4xl pb-6 font-bold text-center">
        What can you do with a PlaySpace?
      </h2>
      <div class="flex flex-wrap container mx-auto justify-center">
        <div class="md:w-6/12 lg:w-4/12 p-2" style="max-width:350px">
          <p-card class="flex flex-col h-full">
            <img src="https://i.imgur.com/IerG6cP.png" alt="" />
            <h2 class="text-2xl mt-2 mb-2 font-bold">
              Stream Your Gameplay
            </h2>
            <p class="flex-grow">
              Easily stream your desktop, web browser tab, or webcam to anyone!
              No software needed. Just send out the link!
            </p>
            <div>
              <!-- <p-btn variant="primary" size="xs" class="py-1 px-3">
                Learn More
              </p-btn> -->
            </div>
          </p-card>
        </div>
        <div class="md:w-6/12 lg:w-4/12 p-2" style="max-width:350px">
          <p-card class="flex flex-col h-full">
            <img src="https://i.imgur.com/czupxMf.png" alt="" />
            <h2 class="text-2xl mt-2 mb-2 font-bold">
              Watch YouTube in Sync
            </h2>
            <p class="flex-grow">
              No more "3. 2. 1. Go!". With our dedicated YouTube synchronized
              player, watching videos with your friends has never been more
              seamless.
            </p>
            <div>
              <!-- <p-btn variant="primary" size="xs" class="py-1 px-3">
                Learn More
              </p-btn> -->
            </div>
          </p-card>
        </div>
        <div class="md:w-6/12 lg:w-4/12 p-2" style="max-width:350px">
          <p-card class="flex flex-col h-full">
            <img
              src="https://i.imgur.com/OoGV3ZA.png"
              alt="PlaySpace UI Mockup"
            />
            <h2 class="text-2xl mt-2 mb-2 font-bold">
              Mix & Match Streams
            </h2>
            <p class="flex-grow">
              Up to 5 people can stream in a single PlaySpace at once. See all
              of your friends' perspectives in the game you're playing. Or use
              it as a collaboration utility.
            </p>
            <div>
              <!-- <p-btn variant="primary" size="xs" class="py-1 px-3">
                Learn More
              </p-btn> -->
            </div>
          </p-card>
        </div>
      </div>
    </div>

    <!-- Testimonials -->
    <div class="my-16 md:my-32 px-2 mx-auto" style="max-width:1500px">
      <h2 class="text-2xl md:text-4xl pb-6 font-bold text-center">
        What are people saying about us?
      </h2>
      <div class="flex flex-wrap">
        <div class="sm:w-6/12 md:w-3/12 p-4 flex flex-col w-full">
          <p class="flex-grow">
            “The future of PlaySpace is loooking really, really good.”
          </p>
          <div class="flex items-center">
            <img
              src="https://i.imgur.com/QkWf1i3.png"
              alt="PlaySpace testimonial user image"
              class="mr-2 mt-2"
              style="height:32px;width:32px"
            />
            <span class="font-bold">derpypineapple13</span>
          </div>
        </div>
        <div class="sm:w-6/12 md:w-3/12 p-4 flex flex-col w-full">
          <p class="flex-grow">
            “Thank you for making this cool site, we really like how simple and
            easy it is to just get in and use!”
          </p>
          <div class="flex items-center">
            <img
              src="https://i.imgur.com/27IoCw7.png"
              alt="PlaySpace testimonial user image"
              class="mr-2 mt-2"
              style="height:32px;width:32px"
            />
            <span class="font-bold">Jam</span>
          </div>
        </div>
        <div class="sm:w-6/12 md:w-3/12 p-4 flex flex-col w-full">
          <p class="flex-grow">
            “A great up and coming streaming/social platform that I'm looking
            forward to see grow and evolve.”
          </p>
          <div class="flex items-center">
            <img
              src="https://i.imgur.com/VOBnwkO.png"
              alt="PlaySpace testimonial user image"
              class="mr-2 mt-2"
              style="height:32px;width:32px"
            />
            <span class="font-bold">Blu3</span>
          </div>
        </div>
        <div class="sm:w-6/12 md:w-3/12 p-4 flex flex-col w-full">
          <p class="flex-grow">
            “PlaySpace was easier to get started with and play games with my
            buddies than any other VoIP solution out there.”
          </p>
          <div class="flex items-center">
            <img
              src="https://i.imgur.com/rlQbYJH.png"
              alt="PlaySpace testimonial user image"
              class="mr-2 mt-2"
              style="height:32px;width:32px"
            />
            <span class="font-bold">Deus Mat</span>
          </div>
        </div>
      </div>
    </div>

    <div class="py-24 bg-dark-2 px-4 text-center">
      <div class="container mx-auto">
        <h2 class="text-2xl md:text-4xl pb-1 font-bold text-center">
          Ready to get started?
        </h2>
        <!-- <p class="text-lg max-w-96 mx-auto">
          Create a PlaySpace, send the link to a friend, and start watching
          together.
        </p> -->
        <div class=" mt-3">
          <ol class="max-w-96 mx-auto">
            <li>
              <div
                class="flex items-center justify-center max-w-64 mx-auto font-bold mb-3"
                :class="{ 'opacity-25': signupStep > 1 }"
              >
                <span
                  class="flex-shrink-0 rounded-full border-primary border-2 h-8 w-8 mr-2"
                >
                  1
                </span>
                <p class="text-left">
                  Sign up for free.
                </p>
              </div>
              <SignupForm
                v-if="signupStep === 1"
                @signup="signupStep++"
                hide-title
                class="mb-5"
              />
            </li>
            <li>
              <div
                class="flex items-center justify-center max-w-64 mx-auto font-bold mb-3"
                :class="{ 'opacity-25': signupStep > 2 }"
              >
                <span
                  class="flex-shrink-0 rounded-full border-primary border-2 h-8 w-8 mr-2"
                >
                  2
                </span>
                <p class="text-left">
                  Create your first PlaySpace.
                </p>
              </div>
              <PlaySpaceForm
                v-if="signupStep === 2"
                @create="onCreatePlaySpace"
                hide-title
                class="mb-5 text-left"
              />
            </li>
            <li>
              <div
                class="flex items-center justify-center max-w-64 mx-auto font-bold mb-3"
                :class="{ 'opacity-25': signupStep > 3 }"
              >
                <span
                  class="flex-shrink-0 rounded-full border-primary border-2 h-8 w-8 mr-2"
                >
                  3
                </span>
                <p class="text-left">
                  Copy the link and send it to a friend.
                </p>
              </div>
              <p-copy
                v-if="signupStep === 3"
                @copy="signupStep++"
                :text="computedNewPlaySpaceLink"
                variant="primary"
                class="mb-5"
              >
                Copy Link
              </p-copy>
            </li>
            <li>
              <div
                class="flex items-center justify-center max-w-64 mx-auto font-bold mb-3"
                :class="{ 'opacity-25': signupStep > 4 }"
              >
                <span
                  class="flex-shrink-0 rounded-full border-primary border-2 h-8 w-8 mr-2"
                >
                  4
                </span>
                <p class="text-left">
                  Start watching together.
                </p>
              </div>
              <div v-if="signupStep === 4">
                Redirecting you in 3 seconds...
              </div>
            </li>
          </ol>
        </div>
        <!-- <p-link to="/create" variant="primary" class="my-2">
          Create a PlaySpace
        </p-link> -->
      </div>
    </div>
  </div>
</template>

<script>
import SignupForm from "@/components/user/SignupForm"
import PlaySpaceForm from "@/components/user/PlaySpaceForm"

export default {
  components: {
    SignupForm,
    PlaySpaceForm
  },

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
          "Do you and your special other live apart from each other? PlaySpace’s Private rooms are a great way to spend time together watching YouTube or browsing the internet together."
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
    // pros: [
    //   "Sub-second video streaming",
    //   "Web Browser-based, no software required",
    //   "Stream with the click of a few buttons",
    //   "Consume all web-based content in a single place."
    // ],
    // cons: [
    //   "Lower video quality than Twitch and YouTube Live",
    //   "With low latency, stream snipers could be a problem",
    //   "It’s still a Beta run by 1 person :P"
    // ],
    signupStep: 1,
    newPlaySpaceId: ""
  }),

  computed: {
    computedNewPlaySpaceLink() {
      return `${window.location.origin}/${this.newPlaySpaceId}`
    }
  },

  methods: {
    onCreatePlaySpace(channelId) {
      this.newPlaySpaceId = channelId
      this.signupStep++
    }
  },

  watch: {
    signupStep(value) {
      // If final step, redirect to newly created playspace in 3 seconds
      if (value === 4) {
        setTimeout(() => {
          this.$router.push(`/p/${this.newPlaySpaceId}`)
        }, 3000)
      }
    },

    "$store.state.user.username"(value) {
      this.signupStep = value ? 2 : 1
    }
  }
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

    &__video {
      &-md {
        position: absolute;
        z-index: -1;
        transform: rotate(-15deg);
        top: -6vw;
      }
    }
  }

  .tiled-content {
    top: 0;
    left: 500px;
    transform: rotate(-35deg);
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
