import Vue from 'vue'
import Vuex from 'vuex'

import logs from './logs'
import zones from './zones'
import user from './user'
import data from './data'

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
    zones,
    user,
    data
  }
})
