import axios from 'axios'
axios.defaults.baseURL = 'http://' + window.location.hostname + ':3000'

const state = () => ({
  currentId: 0,
  items: [
    {
      id: 1,
      name: 'Applications :',
      children: [
        { name: 'Calendar : app' },
        { name: 'Chrome : app' },
        { name: 'Webstorm : app' }
      ]
    },
    {
      id: 2,
      name: 'Documents :',
      children: [
        {
          name: 'vuetify :'
        }
      ]
    },
    {
      id: 3,
      name: 'Downloads :',
      children: [
        { name: 'October : pdf' },
        { name: 'November : pdf' },
        { name: 'Tutorial : html' }
      ]
    },
    {
      id: 4,
      name: 'Videos :',
      children: [
        { name: 'Intro : mov' },
        { name: 'Conference introduction : avi' }
      ]
    }
  ]
})

const mutations = {
  updateId (state, id) {
    state.currentId = id
  },
  addChildren (state) {
    state.items[state.currentId - 1].children.push({ name: '' })
    console.log(state.items[state.currentId - 1])
  },
  changeChildren (state, value) {
    state.items[state.currentId - 1].children[value.id] = { name: value.name }
    console.log(state.items)
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
