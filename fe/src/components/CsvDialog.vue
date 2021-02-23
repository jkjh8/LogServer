<template>
  <v-card>
    <v-card-title
      style="background: #4DB6AC;"
    >
      <h3 class="d-flex pa-2">
        <v-icon large color="yellow">mdi-check-circle-outline</v-icon>
        <div class="px-3" style="color: white;">Download Eventlog File</div>
      </h3>
    </v-card-title>
    <v-card-text class="ma-0 pa-0">
      <v-stepper
        v-model="step"
        vertical
      >
        <v-stepper-step :complete="step > 1" step="1" color="teal lighten-3">
          Select Date
          <small>Select date range for downlaod eventlog to csv</small>
        </v-stepper-step>
        <v-stepper-content step="1">
          <v-card flat>
            <v-row class="d-flex justify-space-around">
              <v-col class="d-flex justify-center">
                <v-date-picker v-model="dates" range color="teal lighten-3" locale="ko-kr" />
              </v-col>
              <v-col>
                <div style="font-size: 1.5em; color: gray;">
                  Seleted Date Range
                </div>
                <div class="text-xl mt-3">
                  {{ `${dateRange[0]} ~ ${dateRange[1]}` }}
                </div>
              </v-col>
            </v-row>
          </v-card>
          <div class="d-flex justify-end">
            <v-btn
              class="mx-1"
              width="120"
              height="50"
              dark
              depressed
              color="orange"
              @click="step=2"
            >
              Continue
            </v-btn>
            <v-btn
              class="mx-1"
              width="120"
              height="50"
              text
              depressed
              @click="$emit('close')"
            >
              Cancel
            </v-btn>
          </div>
        </v-stepper-content>

        <v-stepper-step :complete="step > 2" step="2" color="teal lighten-3">
          Select Zones
          <small>Select Zones for downlaod eventlog to csv</small>
        </v-stepper-step>
        <v-stepper-content step="2">
          <v-card flat>
            <div class="d-flex align-center">
              <v-checkbox v-model="selAllZones" class="ml-3" color="orange"></v-checkbox>
              <div>Select All Zones</div>
            </div>

            <div class="d-flex justify-center" style="max-width: 600px">
              <v-select
                v-show="!selAllZones"
                v-model="selected"
                :items="zonesName"
                label="Select Zones"
                large
                chips
                multiple
                outlined
              >
                <template v-slot:append>
                  <v-btn icon @click="selected=[]">
                    <v-icon color="orange">mdi-refresh</v-icon>
                  </v-btn>
                </template>
              </v-select>
            </div>
          </v-card>
          <div class="d-flex justify-end">
            <v-btn
              class="mx-1"
              width="120"
              height="50"
              dark
              color="teal lighten-3"
              depressed
              @click="downloadFile"
            >
              Download
            </v-btn>
            <v-btn
              class="mx-1"
              width="120"
              height="50"
              text
              depressed
              @click="step=1"
            >
              Back
            </v-btn>
          </div>
        </v-stepper-content>
      </v-stepper>
    </v-card-text>
  </v-card>
</template>

<script>
import zones from '../Zone.json'
import moment from 'moment'

export default {
  data () {
    return {
      step: 1,
      selAllZones: true,
      selected: [],
      dates: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
      zones: zones
    }
  },
  computed: {
    dateRange () {
      // date : 86399000
      let dateR = []
      if (!this.dates[1]) {
        dateR = [this.dates[0], this.dates[0]]
      } else if (this.dates[0] > this.dates[1]) {
        dateR = [this.dates[1], this.dates[0]]
      } else {
        dateR = [this.dates[0], this.dates[1]]
      }
      return dateR
    },
    zonesName () {
      return this.zones.map(e => e.name)
    },
    fileName () {
      if (this.selAllZones) {
        return `${moment().format()}_${this.dateRange.join('~')}_All_Zone.csv`
      } else {
        const zonesName = this.selected.join('_')
        return `${moment().format()}_${this.dateRange.join('~')}_${zonesName}.csv`
      }
    }
  },
  methods: {
    clearSelected () {
      this.step = 1
    },
    downloadFile () {
      const start = moment(this.dateRange[0]).valueOf()
      const end = moment(`${this.dateRange[1]} 23:59:59`).valueOf()
      const zones = this.selected.join(',')
      this.$axios.get(`/api/getlogcsv?start=${start}&end=${end}&all=${this.selAllZones}&zones=${zones}`,
        { responseType: 'blob' }).then(res => {
        const blob = new Blob([res.data])
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.setAttribute('download', this.fileName)
        document.body.appendChild(link)
        link.click()
        URL.revokeObjectURL(link.href)
      }).catch(console.error)
      this.$emit('close')
    }
  }
}
</script>
