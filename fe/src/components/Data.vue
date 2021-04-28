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
              icon
              @click="relay(item.id)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              v-if="item.id"
              icon
              @click="rename(item.id)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
        </v-treeview>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialog">
      <DataDialog :items="items" @close="dialog = false" />
    </v-dialog>
    <v-dialog v-model="dialogRelay">
      <RelayDialog :items="items" @close="dialogRelay = false" />
    </v-dialog>

  </v-container>
</template>

<script>
import DataDialog from './DataDialog'
import RelayDialog from './RelayDialog'

export default {
  components: {
    DataDialog, RelayDialog
  },
  mounted () {
    this.getItems()
  },
  data () {
    return {
      sel: [],
      dialog: false,
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
    rename (id) {
      console.log(id)
      this.$store.commit('data/updateId', id)
      this.dialog = true
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
