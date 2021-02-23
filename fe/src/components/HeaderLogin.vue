<template>
  <div>
    <v-app-bar
      app
      flat
      color="white"
      :height="appbarHeight"
    >
      <div class="d-flex align-center pa-3">
        <a class="d-flex align-center" @click="gotoHome">
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
          text
          height="45px"
          @click="gotoHome"
          :style="value === 'Home' ? 'font-weight: bold; color: black;': 'font-weigth: nomal; color: gray;'">
          Home
        </v-btn>
      </div>
    </v-app-bar>
  </div>
</template>

<script>
import { route } from '../mixins/route'
export default {
  mixins: [route],
  data: () => ({
    value: 'Home'
  }),
  computed: {
    appbarHeight () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 130
        case 'sm': return 100
        case 'md': return 80
        default: return 80
      }
    }
  }
}
</script>
