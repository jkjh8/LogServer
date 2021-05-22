<template>
  <v-card flat class="mx-6">
    <v-card-title>
      Users
    </v-card-title>
    <v-card-text>
      <v-data-table
        class="elevation-1"
        :headers="headers"
        :items="users"
      >
        <template v-slot:item.enable="{ item }">
          <v-simple-checkbox
            :value="item.enable"
            @input="chenable(item)"
          ></v-simple-checkbox>
        </template>
        <template v-slot:item.admin="{ item }">
          <v-simple-checkbox
            value="item.admin"
            @input="chAdmin(item)"
          ></v-simple-checkbox>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import { users } from '../mixins/users'

export default {
  mixins: [users],
  created () { this.getUserInfo() },
  async mounted () {
    this.getUsers()
  },
  computed: {
    rtbool (value) {
      return value === 'true'
    }
  },
  data () {
    return {
      headers: [
        { id: 'ID', sortable: true, value: 'id' },
        { text: 'Name', sortable: true, value: 'name' },
        { text: 'E-Mail', sortable: true, value: 'email' },
        { text: 'Provider', sortable: true, value: 'provider' },
        { text: 'enable', sortable: true, value: 'enable' },
        { text: 'admin', sortable: true, value: 'admin' }
      ],
      users: []
    }
  },
  methods: {
    async getUsers () {
      const token = this.$cookie.get('accessToken')
      const users = await this.$axios.get('/auth/users', { headers: { Authorization: `Bearer ${token}` } })
      this.users = users.data.users
    },
    async chAdmin (admin) {
      const token = this.$cookie.get('accessToken')
      const users = await this.$axios.post('/auth/update', { email: admin.email, admin: !admin.admin, enable: admin.enable }, { headers: { Authorization: `Bearer ${token}` } })
      this.users = users.data.users
    },
    async chenable (admin) {
      const token = this.$cookie.get('accessToken')
      const users = await this.$axios.post('/auth/update', { email: admin.email, admin: admin.admin, enable: !admin.enable }, { headers: { Authorization: `Bearer ${token}` } })
      this.users = users.data.users
    }
  }
}
</script>

<style>

</style>
