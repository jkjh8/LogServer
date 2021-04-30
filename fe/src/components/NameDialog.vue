<template>
  <v-card>
    <v-card-title>
        <div>
          Change Name
        </div>
    </v-card-title>
    <v-card-text>
      <div class="d-flex justify-center align-center my-6">
        <div
          class="px-3 mr-6"
          style="width: 100px"
        >
          <v-combobox
            dense
            hide-details
            label="ID"
            :items="id"
            :value="currentId"
            @change="changeId"
          ></v-combobox>
        </div>
        <div style="width: 150px">
          <v-text-field
            dense
            hide-details
            label="Name"
            v-model="items[currentId - 1].name"
            @keyup.enter="updateName"
          ></v-text-field>
        </div>
        <div>
          {{ items[currentId - 1].code }}
        </div>
      </div>
    </v-card-text>
    <v-card-actions class="d-flex flex-row-reverse">
      <v-btn class="ma-2" dark width="180" height="45" color="pink darken-1" depressed @click="updateName">Accept</v-btn>
      <v-btn class="ma-2" width="180" height="45" color="blue-grey lighten-5" depressed @click="$emit('close')">Decline</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['items'],
  computed: {
    ...mapState({
      currentId: state => state.data.currentId
    })
  },
  data () {
    return {
      id: [],
      zoneName: ''
    }
  },
  mounted () {
    for (let i = 1; i <= this.items.length; i++) {
      this.id.push(i)
    }
  },
  methods: {
    updateName () {
      const name = this.items[this.currentId - 1].name
      this.$axios.post('/api/updateName', { id: this.currentId, name: name, code: this.strEncodeUTF16(name) })
      this.$emit('close')
    },
    completed () {
      this.$axios.post('/api/updateZone', { id: this.currentId, zone: this.items[this.currentId - 1].children })
      this.$emit('close')
    },
    changeId (idx) {
      console.log(idx)
      this.$store.commit('data/updateId', idx)
    },
    strEncodeUTF16 (str) {
      const arr = []
      const hexstr = []
      for (let i = 0; i < str.length; i++) {
        arr[i] = str.charCodeAt(i)
      }
      arr.forEach(num => {
        hexstr.push(this.decimalToHexString(num))
      })
      console.log(hexstr)
      return hexstr.join('')
      // return Array.from(str, (x) => x.charCodeAt(0))
    },
    decimalToHexString (number) {
      if (number < 0) {
        number = 0xFFFFFFFF + number + 1
      }
      return number.toString(16).toUpperCase()
    }
  }
}
</script>

<style>

</style>
