export const getUserInfo = {
  methods: {
    async getUserInfo () {
      const token = this.$cookie.get('accessToken')
      const rtData = await this.$axios.get('/auth/user', { headers: { Authorization: `Bearer ${token}` } })
      if (rtData.data.user) {
        this.user = rtData.data.user
      } else {
        const token = this.$cookie.get('refreshToken')
        console.log(token)
        const rtData = await this.$axios.get('/auth/refresh', { headers: { Authorization: `Bearer ${token}` } })
        this.user = rtData.data.user
        this.$cookie.set('accessToken', rtData.data.accessToken)
        console.log('access token refresh')
      }
      console.log(this.user)
    }
  }
}
