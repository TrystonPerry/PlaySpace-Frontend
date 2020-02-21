import Vue from "vue"

import Vuelidate from "vuelidate"
import PortalVue from "portal-vue"
import Notifications from "vue-notification/dist/ssr.js"

Vue.directive("click-out", {
  bind(el, binding, vnode) {
    binding.stop = e => e.stopPropagation()
    binding.event = () => vnode.context[binding.expression]()
    setTimeout(() => {
      document.body.addEventListener("click", binding.event)
      el.addEventListener("click", binding.stop)
    }, 0)
  },
  unbind(el, binding) {
    document.body.removeEventListener("click", binding.event)
    el.removeEventListener("click", binding.stop)
  }
})

Vue.use(Vuelidate)
Vue.use(PortalVue)
Vue.use(Notifications)
