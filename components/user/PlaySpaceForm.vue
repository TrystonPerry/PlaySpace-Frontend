<template>
  <form @submit.prevent>
    <h1 class="text-3xl text-primary font-medium">Create a PlaySpace</h1>
    <h2 class="text-xl mb-3">You can change any of these later.</h2>
    <label>
      <div class="text-lg font-medium text-primary">Name</div>
      <div class="mb-1">
        This is the name users will see when they see your PlaySpace in the app.
      </div>
      <p-input
        v-model="channelName"
        @blur="checkChannelName"
        type="text"
        placeholder="The Official PlaySpace"
        required
      />
    </label>
    <small v-if="errors.channelName" class="text-red-500">
      {{ errors.channelName }}
    </small>
    <div class="mb-3"></div>
    <label>
      <div class="text-lg font-medium text-primary">Public</div>
      <p-input
        v-model="isPublic"
        :checked="isPublic"
        type="checkbox"
        label="Do you want your PlaySpace to be discoverable to anyone?"
        class="mb-2"
      />
      <div aria-hidden>
        Public Spaces are intended for people who want to share streams with
        anyone on the internet. Private Spaces are for rooms limitted to people
        you invite.
      </div>
    </label>
    <div class="mb-3"></div>
    <label>
      <div class="text-lg font-medium text-primary">Identifier</div>
      <div class="mb-1">
        The is the name that will be used in the url bar to find your PlaySpace.
      </div>
      <p-input
        v-model="id"
        @blur="checkId"
        type="text"
        placeholder="theofficialplayspace"
        :required="isPublic"
        :disabled="!isPublic"
      />
      <span v-if="!isPublic" class="mt-3">
        Note: When making a Private PlaySpace, you will be assigned a random
        identifier. You can change it later if you change it to Public.
      </span>
    </label>
    <small v-if="errors.id" class="text-red-500">
      {{ errors.id }}
    </small>
    <small v-if="errors.general" class="text-red-500 mt-2">
      {{ errors.general }}
    </small>
    <div class="mb-3"></div>
    <p-btn
      @click="onCreate"
      type="submit"
      variant="primary"
      class="mt-4 w-full"
    >
      Create {{ channelName }}
    </p-btn>
  </form>
</template>

<script>
import API from "@/api/api"

const regex = {
  channelName: /^[a-zA-Z0-9 ]{3,24}$/,
  id: /^[a-z0-9\_\-]{3,24}$/,
  avatar: /^(https:\/\/)(\S+\.\S{2,}\.(png|jpg|jpeg))((\/|\?)\S+)?$/
}

export default {
  data: () => ({
    channelName: "",
    id: "",
    isPublic: true,
    errors: {
      channelName: "",
      id: "",
      isPublic: "",
      general: ""
    }
  }),

  methods: {
    async onCreate() {
      const channelName = await this.checkChannelName()
      const id = await this.checkId()

      if (channelName && id) {
        const { data, success, error } = await API.createChannel({
          channelName: this.channelName,
          isPublic: this.isPublic,
          id: this.id
        })

        if (!success) {
          return (this.errors.general = error)
        }

        this.$emit("create", data.id)
      }
    },

    checkChannelName() {
      if (!this.channelName) {
        this.errors.channelName = "No name provided."
      } else if (!regex.channelName.test(this.channelName)) {
        this.errors.channelName =
          "Names must be 3-24 characters long and only contain a-zA-Z0-9 and spaces."
      } else {
        this.errors.channelName = ""
      }
      return !this.errors.channelName
    },

    async checkId() {
      if (this.isPublic) {
        if (!this.id) {
          this.errors.id = "No identifier provided."
        } else if (!regex.id.test(this.id)) {
          this.errors.id =
            "Identifiers must be 3-24 characters long and only contain lowercase a-z0-9_-"
        } else {
          const { data } = await API.checkChannelId(this.id)

          if (!data.answer) {
            this.errors.id = "That identifier is already taken."
          } else {
            this.errors.id = ""
          }
        }
      } else {
        this.errors.id = ""
        return true
      }
      return !this.errors.id
    }
  }
}
</script>

<style></style>
