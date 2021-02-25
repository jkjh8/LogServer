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
  mounted () {
    this.$store.commit('zones/updateZones', [])
    this.$store.commit('zones/updateZonesName', [])
    this.$store.dispatch('logs/changePage', { page: 1 })
    const token = this.$cookie.get('jwt')
    console.log(token)
    this.$axios.get('/auth/user', { headers: { Authorization: `Bearer ${token}` } }).then(async (res) => {
      const data = res.data
      console.log(data)
      await this.$store.commit('user/updateUser', {
        admin: data.admin,
        email: data.email
        // properties: data.kakao.properties
      })
    }).catch((err) => {
      console.log(err)
      this.$router.push('/login')
    })
  },
  computed: {
    ...mapState({
      title: state => state.zones.zonesName
    })
  }
}
</script>
