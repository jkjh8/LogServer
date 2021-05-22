<template>
  <div class="justify-center mt-1 mx-3" v-if="user && user.admin">
    <v-menu
      bottom
      offset-y
      max-width="200px"
    >
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on">
          Admin
        </v-btn>
      </template>
      <v-card>
        <v-list-item-content class="justify-center mx-3">
          <v-btn text @click="$emit('data')">Zones Data</v-btn>
          <v-btn text @click="$emit('backup')">Backup</v-btn>
          <v-btn text @click="$emit('users')">Users</v-btn>
          <v-btn rounded color="orange" @click="$emit('download')">Download</v-btn>
        </v-list-item-content>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      user: state => state.user.user
    }),
    userNick () {
      return this.user.id.slice(0, 2)
    }
  },
  methods: {
    async logout () {
      this.$cookie.delete('accessToken')
      this.$cookie.delete('refreshToken')
      await this.$axios.get('/auth/logout')
      this.$store.commit('user/updateUser', null)
      this.$router.push('/login')
    }
  }
}
</script>
