import axios from 'axios'
axios.defaults.baseURL = 'http://' + window.location.hostname + ':3000'

const state = () => ({
  zones: [],
  zonesName: []
})

const mutations = {
  updateZones (state, zones) {
    state.zones = zones
  },
  updateZonesName (state, payload) {
    state.zonesName = payload
  }
}

const actions = {
  updateZones ({ commit }, payload) {
    commit('updateZones', payload)
    commit('updateZonesName', payload.map(e => e.name))
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
