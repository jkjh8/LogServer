const passport = require("passport")
const passportJWT = require("passport-jwt")
const bcrypt = require("bcrypt")
const path = require('path')
const dotenv = require('dotenv')
const moment = require('moment')

dotenv.config({ path: path.join(__dirname, '../../.env') })

const JWTStrategy = passportJWT.Strategy
const { ExtractJwt } = passportJWT

const LocalStrategy = require("passport-local").Strategy

const User = require("../../models/User")

const cookieExtractor = req => {
  let jwt = null 
  if (req && req.cookies) {
      jwt = req.cookies['jwt']
  }
  return jwt
}

const LocalOption = {
  usernameField: "id",
  passwordField: "password"
}

async function localVerify (id, password, done) {
  let user
  try {
    user = await User.findOne({ id: id },{ _id: 0 })
    if (!user) return done(null, false)
    const isSamePassword = await bcrypt.compare(password, user.password)
    console.log(isSamePassword)
    if (!isSamePassword) return done(null, false)
  } catch (err) {
    done(err)
  }
  console.log('auth ', user)
  return done(null, user)
}

const jwtOption = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

async function jwtVerift (payload, done) {
  console.log(moment(payload.exp * 1000))

  let user
  try {
    user = await User.findOne({ id: payload.id }, { _id: 0 })
    if (!user) return done(null, false)
  } catch (err) { return done(err) }
  return done(null, user)
}

async function refreshVerift (payload, done) {
  let user
  try {
    user = await User.findOne({ id: payload.id })
    if (!user) return done(null, false)
  } catch (err) { return done(err) }
  return done(null, user, payload)
} 

module.exports = () => {
  passport.use(new LocalStrategy(LocalOption, localVerify))
  passport.use('access', new JWTStrategy(jwtOption, jwtVerift))
  passport.use('refresh', new JWTStrategy(jwtOption, refreshVerift))
}
