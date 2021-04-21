<template>
  <v-container>
    <div class="mx-6">
    <v-card flat class="mx-auto" max-width="600">
      <v-card-title>
        <h3>Create a new account</h3>
      </v-card-title>
      <v-card-text>
        <div class="my-2">
          Or use your email account for registration
        </div>
        <div class="my-2">
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <v-text-field
              class="my-3"
              v-model="userInfo.name"
              :rules="rules.name"
              label="Name"
              outlined
              hide-details="auto"
            ></v-text-field>
            <v-text-field
              class="my-3"
              v-model="userInfo.email"
              :rules="rules.email"
              label="E-Mail Address"
              outlined
              hide-details="auto"
            ></v-text-field>
            <v-text-field
              class="my-3"
              v-model="userInfo.password"
              outlined
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              :rules="rules.password"
              label="Password"
              hint="At least 8 characters"
              hide-details="auto"
              @click:append="show1 = !show1"
            ></v-text-field>
            <v-text-field
              class="my-3"
              v-model="userInfo.chkPassword"
              outlined
              :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show2 ? 'text' : 'password'"
              :rules="rules.chkpassword"
              label="Confirm Password"
              hint="At least 8 characters"
              hide-details="auto"
              @click:append="show2 = !show2"
            ></v-text-field>
          </v-form>
        </div>
        <div class="d-flex justify-end">
          <v-btn
            class="mr-3"
            rounded
            depressed
            dark
            height="45"
            width="150px"
            color="teal lighten-3"
            @click="submit"
          >
            Register
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
      show1: false,
      show2: false,
      userInfo: {
        name: '',
        email: '',
        password: '',
        chkPassword: ''
      },
      rules: {
        name: [value => !!value || 'name is required'],
        email: [
          value => !!value || 'E-main is required',
          v => /.+@.+\..+/.test(v) || 'Not in E-mail format'
        ],
        password: [v => v.length >= 8 || 'At least 8 characters are required'],
        chkpassword: [
          v => v.length >= 8 || 'At least 8 characters are required',
          v => v === this.userInfo.password || 'Passwords do not match.'
        ]
      }
    }
  },
  methods: {
    async submit () {
      await this.$refs.form.validate()
      if (this.valid) {
        this.$axios.post('auth/local/register', this.userInfo).then((res) => {
          console.log(res)
        }).catch((err) => {
          alert(err.reponse.data.message)
        })
      }
      this.$router.push('/')
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
</style>
