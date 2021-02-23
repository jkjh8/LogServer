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
    console.log('get user')
    this.$axios.get('/auth/user').then((res) => {
      console.log(res)
    })
  },
  computed: {
    ...mapState({
      title: state => state.zones.zonesName
    })
  }
}
</script>
