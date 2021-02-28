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
          <!--
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
          -->
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
              v-model="userInfo.id"
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
              hide-details="auto"
              @click:append="show = !show"
              @keyup.enter="submit"
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
        id: '',
        password: ''
      },
      rules: {
        email: [
          value => !!value || 'E-main is required',
          v => /.+@.+\..+/.test(v) || 'Not in E-mail format'
        ],
        password: [v => v.length >= 8 || 'At least 8 characters are required']
      },
      kakaoKey: ''
    }
  },
  async beforeCreate () {
    const scriptKakao = document.createElement('script')
    scriptKakao.setAttribute('type', 'text/javascript')
    scriptKakao.src = 'https://developers.kakao.com/sdk/js/kakao.js'
    scriptKakao.async = true
    document.getElementsByTagName('head')[0].appendChild(scriptKakao)
    const key = await this.$axios.get('/auth/kakaokey')
    window.Kakao.init(key.data.key)
  },
  methods: {
    loginKakao () {
      // this.$axios.get('/auth/kakao', { headers: { 'Access-Control-Allow-Origin': '*' } }).then(res => {
      //   console.log(res)
      // })
      // window.location.href = `http://${window.location.hostname}:3000/auth/kakao`
      window.Kakao.Auth.login({
        scope: 'account_email',
        success: this.getUserInfo
      })
    },
    getUserInfo (data) {
      window.Kakao.API.request({
        url: '/v2/user/me',
        success: res => {
          console.log(res)
          this.$axios.post('auth/kakao', res).then(result => {
            this.updateUserInfonCookie(result.data)
          })
        }
      })
    },
    loginGoogle () {
      window.location.href = `http://${window.location.hostname}:3000/auth/google`
    },
    submit () {
      if (this.valid) {
        this.$axios.post('/auth/local', this.userInfo).then((res) => {
          console.log(res.data)
          this.updateUserInfonCookie(res.data)
        }).catch((err) => {
          alert(err.response.data.message)
        })
      }
    },
    updateUserInfonCookie (data) {
      this.$cookie.set('accessToken', data.accessToken)
      this.$cookie.set('refreshToken', data.refreshToken)
      this.$router.push('Home')
    },
    async onSuccess (data) {
      console.log('success', data.access_token)
      const result = await this.$axios.get('https://kapi.kakao.com/v2/user/me', { headers: { Authorization: `Bearer ${data.access_token}` } })
      console.log(result)
    },
    onFailure (data) {
      console.log(data)
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
