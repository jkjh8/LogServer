<template>
  <v-container>
    <div class="mx-6">
    <v-card flat class="mx-auto" max-width="600">
      <v-card-title>
        <h3>Sign in</h3>
      </v-card-title>
      <v-card-text>
        <div>
          <v-btn
            outlined
            rounded
            width="100%"
            height="45"
            @click="loginKakao"
          >
            <div class="d-flex justify-center align-center">
              <div class="pa-3">
                <v-avatar size="30">
                  <v-img
                    src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png"
                  />
                </v-avatar>
                </div>
              <div>Login with KAKAO</div>
            </div>
          </v-btn>
          <v-btn
            class="mt-3"
            outlined
            rounded
            width="100%"
            height="45"
            @click="loginGoogle"
          >
            <div>Login with GOOGLE</div>
          </v-btn>
        </div>
        <div class="my-2">
          Or use your email account
        </div>
        <div class="my-2">
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <v-text-field
              class="my-3"
              v-model="userInfo.email"
              :rules="rules.email"
              label="E-Mail Address"
              outlined
              hide-details="auto"
            />
            <v-text-field
              class="my-3"
              v-model="userInfo.password"
              :rules="rules.password"
              outlined
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show ? 'text' : 'password'"
              label="Password"
              hint="At least 8 characters"
              hide-details="auto"
              @click:append="show = !show"
            />
          </v-form>
        </div>
        <div class="d-flex justify-space-between align-center mx-3">
          <v-checkbox label="Remember Me"></v-checkbox>
          <a style="color: black; text-decoration: underline;">Forgot Your Password?</a>
        </div>
        <div class="d-flex justify-end">
          <v-btn
            class="font-weight-bold mr-3"
            rounded
            depressed
            dark
            height="45"
            width="150px"
            color="teal lighten-3"
            @click="submit"
          >
            Sign in
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
    </div>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      valid: false,
      show: false,
      remember: false,
      userInfo: {
        email: '',
        password: ''
      },
      rules: {
        email: [
          value => !!value || 'E-main is required',
          v => /.+@.+\..+/.test(v) || 'Not in E-mail format'
        ],
        password: [v => v.length >= 8 || 'At least 8 characters are required']
      }
    }
  },
  methods: {
    loginKakao () {
      // this.$axios.get('/auth/kakao', { headers: { 'Access-Control-Allow-Origin': '*' } }).then(res => {
      //   console.log(res)
      // })
      window.location.href = `http://${window.location.hostname}:3000/auth/kakao`
    },
    loginGoogle () {
      // this.$axios.get('/auth/google', { headers: { 'Access-Control-Allow-Origin': '*' } }).then(res => {
      //   console.log(res)
      // })
      window.location.href = `http://${window.location.hostname}:3000/auth/google`
    },
    submit () {
      if (this.valid) {
        this.$axios.post('/auth/local', this.userInfo).then((res) => {
          console.log(res)
          this.$router.push('Home')
        }).catch((err) => {
          alert(err.response.data.message)
        })
      }
    }
  }
}
</script>

<style scoped>
.v-text-field--outlined >>> fieldset {
  border-color: #E1E1E1;
}
.v-btn {
  font-size: 16px;
  text-transform: none !important;
}
.v-btn--outlined {
  border-color: #DCDCDC;
}
</style>
