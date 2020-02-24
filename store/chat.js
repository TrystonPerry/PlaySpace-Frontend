export default {
  state: () => ({
    messages: []
  }),

  mutations: {
    ADD_MESSAGES(state, messages) {
      if (state.messages.length > 99) {
        state.messages.shift()
      }
      state.messages.push(...messages)
    },

    BAN_MESSAGES_BY_USERNAME(state, username) {
      username = username.toLowerCase()
      state.messages = state.messages.filter(msg => {
        return msg.username.toLowerCase() !== username
      })
    },

    SET_MESSAGES(state, messages) {
      state.messages = messages
    }
  }
}
