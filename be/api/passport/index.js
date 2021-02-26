const passport = require("passport")
const passportJWT = require("passport-jwt")
const bcrypt = require("bcrypt")
const path = require('path')
const dotenv = require('dotenv')

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

async function localVerify (email, password, done) {
  let user
  try {
    user = await User.findOne({ email: email })
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
  // jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET
}

async function jwtVerift (payload, done) {
  let user
  try {
    user = await User.findOne({ id: payload.id })
    if (!user) return done(null, false)
    } catch (err) {
      return done(err)
  }
  return done(null, user)
}

module.exports = () => {
  passport.use(new LocalStrategy(LocalOption, localVerify))
  passport.use(new JWTStrategy(jwtOption, jwtVerift))
}
