<template>
  <v-card>
    <v-card-title
      style="background: #4DB6AC;"
    >
      <h3 class="d-flex pa-2">
        <v-icon large color="yellow">mdi-check-circle-outline</v-icon>
        <div class="px-3" style="color: white;">Select Zones</div>
      </h3>
      <v-spacer />
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            color="yellow"
            large
            dark
            v-bind="attrs"
            v-on="on"
            @click="clearSelected"
          >
            mdi-refresh
          </v-icon>
        </template>
        <span>Clear selected items</span>
      </v-tooltip>
    </v-card-title>
    <v-divider />
    <v-card-text>
      <v-item-group
        class="d-flex flex-wrap justify-start"
        v-model="selected"
        multiple
      >
        <v-col
          class="pa-1"
          v-for="(zone, idx) in zones"
          :key="idx"
          :cols="groupCols"
        >
          <v-item v-slot="{ active, toggle }">
            <v-btn
              class="pa-0 ma-0"
              depressed
              @click="toggle"
              large
              :dark="active"
              :color="active ? 'teal lighten-2':'white'"
              :style="active ? 'font-weight: bold;':'font-weight: lighter;'"
            >
              <span class="pa-2 text-wrap text-center" style="max-width: 120px;">
                {{ zone.name }}
              </span>
            </v-btn>
          </v-item>
        </v-col>
      </v-item-group>
    </v-card-text>
    <v-divider />
    <v-card-actions class="d-flex flex-row-reverse">
      <v-btn class="ma-2" dark width="180" height="45" color="pink darken-1" depressed @click="accept">Accept</v-btn>
      <v-btn class="ma-2" width="180" height="45" color="blue-grey lighten-5" depressed @click="close">Decline</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import zones from '../Zone.json'
import { mapState } from 'vuex'

export default {
  computed: {
    groupCols () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 4
        case 'sm': return 3
        case 'md': return 2
        default:
          return 2
      }
    },
    ...mapState({
      page: state => state.logs.zones,
      itemsPerPage: state => state.logs.itemsPerPage
    })
  },
  data () {
    return {
      zones: zones,
      selected: []
    }
  },
  methods: {
    accept () {
      const selectedZone = []
      this.selected.forEach(idx => { selectedZone.push(zones[idx]) })
      this.$emit('accept', selectedZone)
      this.selected = []
    },
    clearSelected () {
      this.selected = []
    },
    close () {
      this.selected = []
      this.$emit('close')
    }
  }
}
</script>
