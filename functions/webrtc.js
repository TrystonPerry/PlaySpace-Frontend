export default {
  async getUserMedia(constraints) {
    try {
      if (constraints.audio) {
        constraints.audio = {
          deviceId: "default",
          echoCancellation: false,
          googAutoGainControl: false
        }
      }
      let stream = await navigator.mediaDevices.getUserMedia(constraints)
      if (stream) {
        return { success: true, stream }
      } else {
        alert("Could not get your requested media")
        return { success: false }
      }
    } catch (err) {
      console.error(err.message) // TODO better error handeling
      return { success: false }
    }
  },

  async getDisplayMedia(constraints) {
    try {
      if (constraints.audio) {
        constraints.audio = {
          autoGainControl: false,
          echoCancellation: false,
          googAutoGainControl: false,
          noiseSuppression: false
        }
      }
      let stream = await navigator.mediaDevices.getDisplayMedia(constraints)
      if (stream) {
        return { success: true, stream }
      } else {
        alert("Could not get your requested media")
        return { success: false }
      }
    } catch (err) {
      console.error(err.message) // TODO better error handeling
      return { success: false }
    }
  }
}
