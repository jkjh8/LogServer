import axios from 'axios'
axios.defaults.baseURL = 'http://' + window.location.hostname + ':3000'

const state = () => ({
  page: 1,
  logItems: [],
  itemsPerPage: 10,
  totalPage: 1,
  search: ''
})

const mutations = {
  updatePage (state, page) {
    state.page = page
  },
  updateLogItems (state, payload) {
    state.logItems = payload
  },
  updateItemPerPage (state, payload) {
    state.itemsPerPage = payload
  },
  updateTotalPage (state, payload) {
    state.totalPage = payload
  },
  updateSearchText (state, payload) {
    state.search = payload
  }
}

const actions = {
  async changePage ({ state, commit }, payload) {
    await commit('updatePage', payload.page)
    axios.get(`/api/getlog?page=${payload.page}&limit=${state.itemsPerPage}&search=${state.search}&zones=${payload.zones}`).then((res) => {
      commit('updateLogItems', res.data.docs)
      commit('updateTotalPage', res.data.totalPages)
    })
  },
  async changeItemPerPage ({ state, commit, dispatch }, value) {
    await commit('updateItemPerPage', value)
    dispatch('changePage', state.page)
  },
  async searchUp ({ commit, dispatch }, search) {
    await commit('updateSearchText', search)
    dispatch('changePage', 1)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
