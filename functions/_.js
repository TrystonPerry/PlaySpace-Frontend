export default {
  throttle: (func, time) => {
    let timeoutId = undefined

    return (...args) => {
      if (timeoutId) return
      timeoutId = setTimeout(() => {
        timeoutId = undefined
        func(...args)
      }, time)
    }
  }
}
