const state = () => ({
  user: null
})

const mutations = {
  updateUser (state, user) {
    state.user = user
  }
}

const actions = {
  updateUser ({ commit }, payload) {
    commit('updateUser', payload)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
