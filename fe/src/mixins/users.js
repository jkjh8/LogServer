export const users = {
  methods: {
    async getUserInfo () {
      const token = await this.$cookie.get('accessToken')
      if (!token) return this.refreshToken()

      const headers = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const rtData = await this.$axios.get('/auth/user', headers)
      if (rtData.data.user) {
        if (!rtData.data.user.enable) {
          return this.$router.push('/login')
          // return alert('인증되지 않은 사용자 입니다.')
        }
        return this.$store.commit('user/updateUser', rtData.data.user)
      }

      this.refreshToken()
    },
    async refreshToken () {
      const token = this.$cookie.get('refreshToken')
      if (!token) return this.$router.push('login')

      const headers = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const rtData = await this.$axios.get('/auth/refresh', headers)
      if (rtData.data.user) {
        if (!rtData.data.user.enable) {
          return alert('인증되지 않은 사용자 입니다.')
        }
        this.$store.commit('user/updateUser', rtData.data.user)
      }
      if (rtData.data.refreshToken) {
        this.$cookie.set('refreshToken', rtData.data.refreshToken)
      }
      if (rtData.data.accessToken) {
        return this.$cookie.set('accessToken', rtData.data.accessToken)
      }

      this.$router.push('/login')
    }
  }
}
