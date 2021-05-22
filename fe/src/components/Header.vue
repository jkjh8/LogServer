<template>
  <div>
    <v-app-bar
      app
      flat
      color="white"
      :height="appbarHeight"
    >
      <div class="d-flex pa-3">
        <a class="d-flex align-center" @click="clickHome">
          <v-icon color="teal lighten-2" size="42">
            mdi-play
          </v-icon>
          <h1>
            <span style="color: black">Log Server</span>
          </h1>
        </a>
        <span
          class="align-self-end mx-3 pb-2"
        >
          <h5 style="color: gray;">
            For Lotte Department Store
          </h5>
        </span>
      </div>
      <v-spacer />
      <div class="d-flex justify-center">
        <v-btn
          class="mx-1"
          height="45px"
          text
          @click="clickHome"
          :style="value === 'Home' ? 'font-weight: bold; color: black;': 'font-weigth: nomal; color: gray;'"
        >
          Home
        </v-btn>
        <v-btn
          class="mx-1"
          height="45px"
          text
          @click="zoneSelOpen"
          :style="value === 'Zones' ? 'font-weight: bold; color: black;': 'font-weigth: nomal; color: gray;'"
        >
          Zones
        </v-btn>
        <Admin @data="gotoData" @backup="backup=true" @users="gotoUsers" @download="download=true" />
      </div>
      <v-divider class="mx-3" inset vertical></v-divider>
      <LoginUser />
      <div class="d-flex mx-3">
        <v-text-field
          class="mt-1"
          v-model="search"
          outlined
          rounded
          hide-details
          dense
          @keyup.enter="searchUp"
          label="Search"
        >
          <template v-slot:append>
            <v-icon @click="searchUp">mdi-magnify</v-icon>
          </template>
        </v-text-field>
        <v-btn
          class="mx-2"
          icon
          @click="reload"
        >
          <v-icon size="42" color="teal lighten-3">mdi-refresh-circle </v-icon>
        </v-btn>
      </div>
    </v-app-bar>

    <v-dialog max-width="800px" v-model="dialog">
      <ZonesSelect @accept="zoneSel" @close="dialog=false" />
    </v-dialog>
    <v-dialog max-width="800px" v-model="download">
      <CsvDownload @close="download=false" />
    </v-dialog>
    <v-dialog max-width="800px" v-model="backup">
      <Backup @close="backup=false" />
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ZonesSelect from '../components/zoneDialog'
import CsvDownload from '../components/CsvDialog'
import LoginUser from '../components/LoginUser'
import Admin from '../components/Admin'
import Backup from '../components/Backup'
import { route } from '../mixins/route'

export default {
  mixins: [route],
  components: {
    ZonesSelect,
    CsvDownload,
    Backup,
    LoginUser,
    Admin
  },
  data: () => ({
    value: 'Home',
    search: '',
    download: false,
    backup: false,
    dialog: false,
    users: false
  }),
  computed: {
    appbarHeight () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 130
        case 'sm': return 100
        case 'md': return 80
        default: return 80
      }
    },
    ...mapState({
      user: state => state.user.user,
      page: state => state.logs.zones,
      itemsPerPage: state => state.logs.itemsPerPage
    }),
    userNick () {
      return this.user.id.slice(0, 2)
    }
  },
  methods: {
    searchUp () {
      this.$store.dispatch('logs/searchUp', this.search)
    },
    reload () {
      this.$store.dispatch('logs/changePage', { page: this.$store.state.logs.page })
    },
    zoneSelOpen () {
      this.gotoHome()
      this.dialog = true
    },
    zoneSel (zones) {
      console.log(zones)
      if (zones.length > 0) {
        this.$store.dispatch('zones/updateZones', zones)
        this.$store.dispatch('logs/changePage', { page: 1, zones: zones.map(e => e.name).join(',') })
        this.value = 'Zones'
      } else {
        this.$store.dispatch('zones/updateZones', [])
        this.value = 'Home'
      }
      this.dialog = false
    },
    async logout () {
      this.$cookie.delete('accessToken')
      this.$cookie.delete('refreshToken')
      await this.$axios.get('/auth/logout')
      this.$store.commit('user/updateUser', null)
      this.$router.push('/login')
    },
    account () {
      console.log('click avatar')
    }
  }
}
</script>
