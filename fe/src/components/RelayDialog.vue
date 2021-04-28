<template>
  <v-card>
    <v-card-title>
      <div class="ml-6">ID</div>
      <div
        class="px-3 mr-6"
        style="width: 100px"
      >
        <v-combobox
          :items="id"
          :value="currentId"
          @change="changeId"
        ></v-combobox>
      </div>
      <div class="mx-6">Name</div>
      <div>
        <v-text-field
          v-model="items[currentId - 1].name"
          @keyup.enter="updateName"
        ></v-text-field>
      </div>
      <v-spacer />
      <v-btn icon @click="addRelay">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item
          v-for="(item, idx) in items[currentId - 1].relay"
          :key="idx"
        >
          <div>Channel</div>
          <div class="mx-6">
            {{ idx + 1 }}
          </div>
          <div class="mx-6">Name</div>
          <div>
            <v-text-field
              :value="item.name"
              @change="update(idx, $event)"
            >
            </v-text-field>
          </div>
          <div class="mx-6">
            Code
          </div>
          <div>
            {{ item.code }}
          </div>
          <div class="ml-6">
            <v-btn icon @click="delZone(idx)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions class="d-flex flex-row-reverse">
      <v-btn class="ma-2" dark width="180" height="45" color="pink darken-1" depressed @click="completed">Accept</v-btn>
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
    },
    addRelay () {
      const id = this.items[this.currentId - 1].relay.length
      this.items[this.currentId - 1].relay.push({
        idx: id,
        name: '',
        code: ''
      })
    },
    update (idx, evt) {
      // this.$store.commit('data/changerelay', { id: idx, name: evt })
      // this.items[this.curitem.id - 1].relay[idx].name = evt
      console.log(idx, evt)
      this.items[this.currentId - 1].relay[idx].name = evt
      this.items[this.currentId - 1].relay[idx].code = this.strEncodeUTF16(evt)
    },
    delZone (idx) {
      this.items[this.currentId - 1].relay.splice(idx, 1)
      this.items[this.currentId - 1].relay.forEach((item, idx) => {
        item.idx = idx
      })
    },
    completed () {
      this.$axios.post('/api/updateRelay', { id: this.currentId, zone: this.items[this.currentId - 1].relay })
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
