<template>
  <div>
    <div class="d-flex nowarp" v-if="user">
      <v-menu
        v-if="user.provider === 'kakao'"
        bottom
        rounded
        min-width="200px"
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            x-large
            v-on="on"
          >
            <v-avatar>
              <v-avatar
                color="teal lighten-3"
                size="45"
              >
                <img
                  :src="user.kakao.profile.thumbnail_image_url"
                  alt="User"
                >
              </v-avatar>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-list-item-content class="justify-center">
            <div class="mx-auto text-center">
              <v-avatar
                color="teal lighten-3"
                size="60"
              >
                <img
                  :src="user.kakao.profile.thumbnail_image_url"
                  alt="User"
                >
              </v-avatar>
              <h3 class="mt-3">{{ user.name }}</h3>
              <p class="caption mt-1">{{ user.email }}</p>
              <v-btn
                height="45px"
                depressed
                dark
                rounded
                color="teal lighten-3"
                @click="logout"
              >
                Logout
              </v-btn>
            </div>
          </v-list-item-content>
        </v-card>
      </v-menu>

      <v-menu
        v-else
        bottom
        rounded
        min-width="200px"
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            x-large
            v-on="on"
          >
            <v-avatar>
              <v-avatar
                color="teal lighten-3"
                size="45"
              >
                <span class="white--text">{{ userNick }}</span>
              </v-avatar>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-list-item-content class="justify-center">
            <div class="mx-auto text-center">
              <v-avatar
                color="teal lighten-3"
                size="60"
              >
                <h2 class="white--text text-uppercase">{{ userNick }}</h2>
              </v-avatar>
              <p class="caption mt-1">{{ user.email }}</p>
              <v-btn
                height="45px"
                depressed
                dark
                rounded
                color="teal lighten-3"
                @click="logout"
              >
                Logout
              </v-btn>
            </div>
          </v-list-item-content>
        </v-card>
      </v-menu>
    </div>
    <div v-else>
      <v-btn
        height="45px"
        depressed
        dark
        color="teal lighten-3"
        to="/login"
      >
        Login
      </v-btn>
    </div>
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
