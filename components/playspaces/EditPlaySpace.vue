<template>
  <form @submit.prevent>
    <h1 class="text-2xl font-medium mb-2">Edit PlaySpace Info</h1>
    <div class="mb-2">
      <p-input v-model="channelName" @blur="checkChannelName" label="Name" type="text" />
      <small v-if="errors.channelName" class="text-red-500">{{ errors.channelName }}</small>
    </div>
    <div class="mb-2">
      <p-input v-model="title" @blur="checkTitle" label="Title" type="text" />
      <small v-if="errors.title" class="text-red-500">{{ errors.title }}</small>
    </div>
    <!-- <p-input v-model="category" label="Category" type="text" />
    <small v-if="errors.channelName" class="text-red-500">
        {{ errors.channelName }}
    </small>-->
    <div class="mb-3">
      <p-input v-model="avatar" @blur="checkAvatar" label="Logo URL (https)" type="text" />
      <small v-if="errors.avatar" class="text-red-500">{{ errors.avatar }}</small>
    </div>
    <p-input v-model="isPublic" label="Public" type="checkbox" class="mb-4" />
    <p-btn @click="onSave" variant="primary">Save</p-btn>
  </form>
</template>

<script>
import API from "@/api/api"

const regex = {
  channelName: /^[a-zA-Z0-9 ]{3,24}$/,
  title: /^.{1,64}$/,
  avatar: /^(https:\/\/)(\S+\.\S{2,}\.(png|jpg|jpeg))((\/|\?)\S+)?$/
}

export default {
  data: () => ({
    channelName: "",
    title: "",
    category: "",
    avatar: "",
    isPublic: false,
    errors: {
      channelName: "",
      title: "",
      avatar: ""
    }
  }),

  async created() {
    const { data, success, error } = await API.getPlaySpace(
      this.$route.params.playspace
    )

    if (!success) {
      return alert(error)
    }

    this.channelName = data.channelName
    this.title = data.title
    this.category = data.category
    this.avatar = data.avatar
    this.isPublic = data.isPublic
  },

  methods: {
    async onSave() {
      const channelName = this.checkChannelName()
      const title = this.checkTitle()
      const avatar = this.checkAvatar()

      if (channelName && title && avatar) {
        const { data, success, error } = await API.updateChannel(
          this.$route.params.playspace,
          {
            channelName: this.channelName,
            title: this.title,
            avatar: this.avatar,
            isPublic: this.isPublic
          }
        )

        if (!success) {
          return alert(error)
        }

        this.$emit("edit")
      }
    },

    checkChannelName() {
      if (!regex.channelName.test(this.channelName)) {
        this.errors.channelName =
          "Names must be 3-24 characters long and only contain a-zA-Z0-9 and spaces."
      } else {
        this.errors.channelName = ""
      }
      return !this.errors.channelName
    },

    checkTitle() {
      if (!regex.title.test(this.title)) {
        this.errors.title = "The title must be between 1-64 characters"
      } else {
        this.errors.title = ""
      }
      return !this.errors.title
    },

    checkAvatar() {
      if (this.avatar) {
        if (!regex.avatar.test(this.avatar)) {
          this.errors.avatar = "Your avatar url must be https: and .png or .jpg"
        }
      } else {
        this.errors.avatar = ""
      }
      return !this.errors.avatar
    }
  }
}
</script>

<style>
</style>