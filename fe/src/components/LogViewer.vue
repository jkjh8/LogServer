<template>
  <v-container>
    <v-card flat class="mx-none px-none">
      <v-card-title
        v-if="title.length > 0"
        style="background: #E0F2F1; border: none; border-radius: 20px;"
      >
        <v-chip
          v-for="(chip, idx) in title"
          :key="idx"
          class="ma-1"
          color="orange accent-4"
          close
          outlined
          @click:close="closeChips(idx)"
        >
          {{ chip }}
        </v-chip>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="logItems"
          :items-per-page="50"
          hide-default-footer
        >
          <template v-slot:item.date="{ item }">
            {{ new Date(item.date).toLocaleString() }}
          </template>
        </v-data-table>
        <v-divider />
        <div class="d-flex justify-space-between mt-2">
          <div class="mt-2">
            <v-icon
              v-show="false"
              color="yellow"
              @click="$store.dispatch('logs/changePage', { page: page })"
            >
              mdi-reload
            </v-icon>
          </div>
          <div style="min-width: 400px">
            <v-pagination
              :value="page"
              :length="totalPage"
              :total-visible="10"
              color="teal lighten-3"
              @input="next"
            />
          </div>
          <div style="width: 90px">
            <v-select
              :value="itemsPerPage"
              :items="pagePerItems"
              label="PagePerList"
              outlined
              dense
              @change="changePagePerItems"
            />
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['title'],
  computed: {
    ...mapState({
      page: state => state.logs.page,
      totalPage: state => state.logs.totalPage,
      logItems: state => state.logs.logItems,
      itemsPerPage: state => state.logs.itemsPerPage,
      zones: state => state.zones.zones
    })
  },
  mounted () {
    this.$store.dispatch('logs/changePage', { page: this.page })
  },
  watch: {
    title: function (newVal) {
      if (newVal.length === 0) {
        this.$store.dispatch('logs/changePage', { page: 1 })
        console.log('changepage')
      }
    }
  },
  data () {
    return {
      headers: [
        { text: 'Date', value: 'date' },
        { text: 'Source', value: 'source' },
        { text: 'Category', value: 'category' },
        { text: 'Priority', value: 'priority' },
        { text: 'Zones', value: 'zones' },
        { text: 'Message', value: 'message' }
      ],
      pagePerItems: [5, 10, 20, 30, 40, 50],
      search: ''
    }
  },
  methods: {
    changePagePerItems (value) {
      this.$store.dispatch('logs/changeItemPerPage', value)
      this.$store.dispatch('logs/changePage', { page: 1 })
    },
    async closeChips (idx) {
      await this.zones.splice(idx, 1)
      this.$store.dispatch('zones/updateZones', this.zones)
      this.$store.dispatch('logs/changePage', { page: this.$store.state.logs.page, zones: this.zones })
    },
    next (evt) {
      console.log(this.zones)
      if (this.zones.length > 0) {
        this.$store.dispatch('logs/changePage', { page: evt, zones: this.zones.map(e => e.name).join(',') })
      } else {
        this.$store.dispatch('logs/changePage', { page: evt })
      }
    }
  }
}
</script>
