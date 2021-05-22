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
      <div>
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
        <v-btn
          class="mx-1"
          height="45px"
          text
          @click="gotoData"
          :style="value === 'Data' ? 'font-weight: bold; color: black;': 'font-weigth: nomal; color: gray;'"
        >
          Data
        </v-btn>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="ml-1"
              height="45px"
              depressed
              color="orange"
              dark
              v-bind="attrs"
              v-on="on"
              @click="download=true"
            >
              Download
            </v-btn>
          </template>
          <span>Download event log to CSV file</span>
        </v-tooltip>
        <v-tooltip bottom v-if="user && user.admin">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="ml-1"
              height="45px"
              depressed
              v-bind="attrs"
              v-on="on"
              @click="backup=true"
            >
              Backup
            </v-btn>
          </template>
          <span>Backup all data to CSV file</span>
        </v-tooltip>
        <v-tooltip bottom v-if="user && user.admin">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="ml-1"
              height="45px"
              depressed
              v-bind="attrs"
              v-on="on"
              @click="users=true"
            >
              Users
            </v-btn>
          </template>
          <span>Users</span>
        </v-tooltip>
      </div>
      <v-divider class="mx-3" inset vertical></v-divider>
      <div class="d-flex nowarp" v-if="user">
        <v-menu
          v-if="user.provider === 'kakao'"
          bottom
          rounded
          min-width="200px"
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              x-large
              v-on="on"
            >
              <v-avatar>
                <v-avatar
                  color="teal lighten-3"
                  size="45"
                >
                  <img
                    :src="user.kakao.profile.thumbnail_image_url"
                    alt="User"
                  >
                </v-avatar>
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-list-item-content class="justify-center">
              <div class="mx-auto text-center">
                <v-avatar
                  color="teal lighten-3"
                  size="60"
                >
                  <img
                    :src="user.kakao.profile.thumbnail_image_url"
                    alt="User"
                  >
                </v-avatar>
                <h3 class="mt-3">{{ user.name }}</h3>
                <p class="caption mt-1">{{ user.email }}</p>
                <v-btn
                  height="45px"
                  depressed
                  dark
                  rounded
                  color="teal lighten-3"
                  @click="logout"
                >
                  Logout
                </v-btn>
              </div>
            </v-list-item-content>
          </v-card>
        </v-menu>

        <v-menu
          v-else
          bottom
          rounded
          min-width="200px"
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              x-large
              v-on="on"
            >
              <v-avatar>
                <v-avatar
                  color="teal lighten-3"
                  size="45"
                >
                  <span class="white--text">{{ userNick }}</span>
                </v-avatar>
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-list-item-content class="justify-center">
              <div class="mx-auto text-center">
                <v-avatar
                  color="teal lighten-3"
                  size="60"
                >
                  <h2 class="white--text text-uppercase">{{ userNick }}</h2>
                </v-avatar>
                <p class="caption mt-1">{{ user.email }}</p>
                <v-btn
                  height="45px"
                  depressed
                  dark
                  rounded
                  color="teal lighten-3"
                  @click="logout"
                >
                  Logout
                </v-btn>
              </div>
            </v-list-item-content>
          </v-card>
        </v-menu>
      </div>
      <div v-else>
        <v-btn
          height="45px"
          depressed
          dark
          color="teal lighten-3"
          @click="gotoLogin"
        >
          Login
        </v-btn>
      </div>
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
import Backup from '../components/Backup'
import { route } from '../mixins/route'

export default {
  mixins: [route],
  components: {
    ZonesSelect,
    CsvDownload,
    Backup
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
