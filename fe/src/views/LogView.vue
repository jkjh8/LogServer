<template>
  <div class="home">
    <LogViewer :title='title' />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LogViewer from '../components/LogViewer'

export default {
  name: 'Home',
  components: {
    LogViewer
  },
  data () {
    return {
      user: null
    }
  },
  async mounted () {
    this.$store.commit('zones/updateZones', [])
    this.$store.commit('zones/updateZonesName', [])
    this.$store.dispatch('logs/changePage', { page: 1 })
    await this.getUserInfo()
    if (this.user && this.user.provider === 'kakao') {
      this.$store.commit('user/updateUser', {
        admin: this.user.admin,
        email: this.user.email,
        properties: this.user.kakao.properties
      })
    } else if (this.user) {
      this.$store.commit('user/updateUser', {
        admin: this.user.admin,
        email: this.user.email
      })
    } else {
      this.$store.commit('user/updateUser', null)
    }
  },
  computed: {
    ...mapState({
      title: state => state.zones.zonesName
    })
  },
  methods: {
    async getUserInfo () {
      const token = this.$cookie.get('accessToken')
      const rtData = await this.$axios.get('/auth/user', { headers: { Authorization: `Bearer ${token}` } })
      if (rtData.data.user) {
        this.user = rtData.data.user
      } else {
        const token = this.$cookie.get('refreshToken')
        const rtData = await this.$axios.get('/auth/refresh', { headers: { Authorization: `Bearer ${token}` } })
        this.user = rtData.data.user
        this.$cookie.set('accessToken', rtData.data.accessToken)
        console.log('access token refresh')
      }
    }
  }
}
</script>
