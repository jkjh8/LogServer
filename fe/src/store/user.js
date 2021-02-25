const state = () => ({
  user: {
    admin: true,
    email: 'jkjh82@daum.net',
    properties: {
      nickname: '강준호',
      profile_image: 'http://k.kakaocdn.net/dn/bg8nhM/btqM4CdGcI0/mw4xCl27VW2UwNHCLQ1vFk/img_640x640.jpg',
      thumbnail_image: 'http://k.kakaocdn.net/dn/bg8nhM/btqM4CdGcI0/mw4xCl27VW2UwNHCLQ1vFk/img_110x110.jpg'
    }
  }
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
