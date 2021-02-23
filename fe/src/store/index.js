import Vue from 'vue'
import Vuex from 'vuex'

import logs from './logs'
import zones from './zones'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    logs,
    zones
  }
})
