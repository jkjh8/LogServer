export const route = {
  methods: {
    gotoLogin () {
      this.$router.push('login')
    },
    gotoHome () {
      this.$router.push('/')
      this.value = 'Home'
    },
    clickHome () {
      this.value = 'Home'
      this.$store.commit('zones/updateZones', [])
      this.$store.commit('zones/updateZonesName', [])
      this.$store.dispatch('logs/changePage', { page: 1 })
    },
    logout () {
      this.$axios.get('/auth/logout').then(res => {
        this.$store.commit('user/updateUser', null)
        this.$cookie.delete('accessToken')
        // this.$cookie.delete('refreshToken')
      })
    }
  }
}
