<template>
  <v-container>
    <v-card>
      <v-card-title>
        <v-btn @click="add">ADD</v-btn>
      </v-card-title>
      <v-card-text>
        <v-treeview
          v-model="sel"
          open-on-click
          :items="items"
        >
          <template v-slot:append="{ item }">
            <v-btn
              v-if="item.id"
              text
              @click="name(item.id)"
            >
              Name
            </v-btn>
            <v-btn
              v-if="item.id"
              text
              @click="relay(item.id)"
            >
              Relay
            </v-btn>
            <v-btn
              v-if="item.id"
              text
              @click="zone(item.id)"
            >
              Zone
            </v-btn>
          </template>
        </v-treeview>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialogName" max-width="800px">
      <NameDialog :items="items" @close="dialogName = false" @add="add" />
    </v-dialog>
    <v-dialog v-model="dialogZone" max-width="800px">
      <DataDialog :items="items" @close="dialogZone = false" />
    </v-dialog>
    <v-dialog v-model="dialogRelay" max-width="800px">
      <RelayDialog :items="items" @close="dialogRelay = false" />
    </v-dialog>

  </v-container>
</template>

<script>
import NameDialog from './NameDialog'
import DataDialog from './DataDialog'
import RelayDialog from './RelayDialog'
import { users } from '../mixins/users'

export default {
  mixins: [users],
  components: {
    NameDialog, DataDialog, RelayDialog
  },
  mounted () {
    this.getItems()
  },
  data () {
    return {
      sel: [],
      dialogName: false,
      dialogZone: false,
      dialogRelay: false,
      items: []
    }
  },
  methods: {
    async getItems () {
      const rt = await this.$axios.get('api/getdata')
      this.items = rt.data.data
      console.log(this.items)
    },
    name (id) {
      this.$store.commit('data/updateId', id)
      this.dialogName = true
    },
    zone (id) {
      console.log(id)
      this.$store.commit('data/updateId', id)
      this.dialogZone = true
    },
    relay (id) {
      this.$store.commit('data/updateId', id)
      this.dialogRelay = true
    },
    async add () {
      console.log('add')
      const id = this.items.length + 1
      await this.$axios.post('api/addZone', { id: id, name: '', code: '', children: [] })
      this.getItems()
    }
  }
}
</script>

<style>

</style>
