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
      if (this.value !== 'Home') {
        this.value = 'Home'
        this.$router.push('/')
      }
      this.$store.commit('zones/updateZones', [])
      this.$store.commit('zones/updateZonesName', [])
      this.$store.dispatch('logs/changePage', { page: 1 })
    },
    gotoData () {
      this.$router.push('/data')
      this.value = 'Data'
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
