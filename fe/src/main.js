import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueCookie from 'vue-cookie'

Vue.config.productionTip = false

axios.defaults.baseURL = 'http://' + window.location.hostname + ':3000'
Vue.prototype.$axios = axios
Vue.use(VueCookie)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
