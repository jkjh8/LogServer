const LocalStrategy = require('passport-local').Strategy
const KakaoStrategy = require('passport-kakao').Strategy
var GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require("../../models/User")
const bcrypt = require('bcrypt')
const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ path: path.join(__dirname, '../../.env') })

exports.config = (passport) => {
  console.log('startlogin')
  passport.serializeUser((user, done) => {
    done(null, user.email)
  })

  passport.deserializeUser((email, done) => {
    const result = User.findOne({ email: email },(err, user) => {
      if (err) return console.log(err)
      done(null, user);
    })
  })

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, (email, password, done) => {
    const result = User.findOne({ email: email }, (err, user) => {
      if (err) return console.log(err)
      if (!user) {
        done(null, false, { message: "Check your E-Mail"});
      } else {
        console.log(user.password)
        console.log(password)
        if (bcrypt.compareSync(password, user.password)) {
          done(null, user)
        } else {
          done(null, false, { message: "Check your password"});
        }
      }
    })
  }))

  passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_ID,
    callbackURL: 'http://localhost:3000/auth/kakao/callback'
  }, (accessToken, refreshToken, profile, done) => {
    console.log(accessToken, refreshToken, profile, done)
    User.findOne({ 'kakao.id': profile.id }, (err, user) => {
      if (err) { return done(err) }
      if (!user) {
        user = new User({
          name: profile.username,
          username: profile.id,
          email: profile._json.kakao_account.email,
          roles: ['authenticated'],
          provider: 'kakao',
          kakao: profile._json,
        })

        user.save((err) => {
          if (err) { console.log(err) }
          return done(err, user)
        })
      } else {
        return done(err, user)
      }
    })
  }))

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_PASSWORD,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(accessToken, refreshToken, profile, done)
    done(null, profile)
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    }
  ))
}
