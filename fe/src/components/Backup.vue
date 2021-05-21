<template>
  <v-card>
    <v-card-title>Log Backup</v-card-title>
    <v-card-text>
      <div class="row justify-center ma-6">
        <v-btn
          class="ma-4"
          @click="getBackup"
        >
          Backup Log
        </v-btn>
        <div class="text-center ma-4">
          <v-dialog
            v-model="dialog"
            width="500"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="red lighten-2"
                dark
                v-bind="attrs"
                v-on="on"
              >
                Delete all log
              </v-btn>
            </template>

            <v-card>
              <v-card-title class="headline grey lighten-2">
                Confirm
              </v-card-title>

              <v-card-text>
                <div class="mt-6">
                  정말 삭제하시겠습니까?
                </div>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  text
                  @click="deleteAll"
                >
                  I accept
                </v-btn>
                <v-btn
                  color="red"
                  text
                  @click="dialog = false"
                >
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </div>
    </v-card-text>
    <v-card-actions class="d-flex flex-row-reverse">
      <v-btn class="ma-2" width="180" height="45" color="blue-grey lighten-5" depressed @click="$emit('close')">Close</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      dialog: false
    }
  },
  computed: {
    fileName () {
      return `${moment().format()}_backup.csv`
    }
  },
  methods: {
    getBackup () {
      this.$axios.get('/api/getbackup', { responseType: 'blob' }).then(res => {
        const blob = new Blob([res.data])
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.setAttribute('download', this.fileName)
        document.body.appendChild(link)
        link.click()
        URL.revokeObjectURL(link.href)
      }).catch(console.error)
    },
    deleteAll () {
      this.$axios.get('/api/dellog').then(res => {
        console.log(res)
        this.$emit('close')
        this.$router.push('/')
      }).catch(console.error)
    }
  }
}
</script>
