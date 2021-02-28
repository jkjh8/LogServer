const passport = require('passport')
const User = require('../../models/User')
const jwt = require('jsonwebtoken')

const moment = require('moment')

const path = require('path')
const dotenv = require('dotenv')
dotenv.config({ path: path.join(__dirname, '../../.env') })

module.exports.register = async function(req, res) {  
  const currentEmail = await User.findOne({ email: req.body.email })
  if (currentEmail !== null) {
    return res.status(500).json({ message: 'This email is already use' })
  }
  const user = new User({
    id: req.body.email,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    provider: 'local'
  })
  user.save((err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Error on register' })
    }
    return res.status(200).json({
      message: 'user save complate', _id: user._id
    })
  })
}

module.exports.login = function (req, res, next) {
  // console.log(req.body)
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err || !user) return res.status(400).json({ message: 'Error! user not found' })
    req.login(user, { session: false }, (error) => {
      if (error) return res.state(401).json({ message: error })
      const rtObj = {
        accessToken: jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '5m'}),
        refreshToken: jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d'}),
        user: user
      }
      return res.status(200).json(rtObj)
    })
  })(req, res)
}

module.exports.loginKakao = async function(req, res, next) {
  let user
  const profile = req.body
  try {
    user = await User.findOne({ id: profile.id })
    console.log(user)
    if (!user) {
      console.log('not user')
      console.log(profile.kakao_account.email)
      user = new User({
        id: profile.id,
        name: profile.properties.nickname,
        username: profile.id,
        email: profile.kakao_account.email,
        roles: ['authenticated'],
        provider: 'kakao',
        kakao: profile.kakao_account,
        block: false
      })
      console.log('1')
      user.save(err => {
        if (err) {
          console.log(err)
          return res.statue(500).json({ result: 'err', message: '사용자를 추가 할 수 없습니다.' })
        }
      })
    }
    const rtObj = {
      accessToken: jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '5m'}),
      refreshToken: jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d'}),
      user: user
    }
    if (user.block) return res.status(403).json({ user: false })
    return res.status(200).json(rtObj)
  } catch (err) {
    console.log(err)
    res.status(403).json({ error: err })
  }
}


module.exports.loginGoogle = function(req, res, next) {
  console.log('start google')
  passport.authenticate('google', { scope: ['profile'] }, (err, user, info) => {
    if (err) { return next(err) }
    if (!user) { return res.status(403).json(info) }
    return req.loginGoogle(user, (err) => {
      if (err) { return next(err) }
      return res.status(200).json({ user })
    })
  }) (req, res, next)
}

module.exports.user = function(req, res) {
  passport.authenticate('access', { session: false }, (err, user) => {
    if (err) { return res.status(403).json({ user: null }) }
    if (user.block) { return res.status(403).json({ user: null }) }
    res.status(200).json({ user: user })
  })(req, res)
}

module.exports.refresh = function(req, res) {
  passport.authenticate('refresh', { session: false }, (err, user, payload) => {
    if (err||!user) return res.status(403).json({ user: null })
    const time1 = moment()
    const time2 = moment(payload.exp * 1000)
    console.log('user = ', user)
    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '5m'})
    
    if (moment.duration(time2.diff(time1)).asDays() < 1) {
      const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d'})
      return res.status(200).json({ refreshToken: refreshToken, accessToken: accessToken, user: user })
    }
    res.status(200).json({ accessToken: accessToken, user: user })
  })(req, res)
}


module.exports.logout = function(req, res) {
  req.logout()
  return res.status(200).json({
    message: 'Logout complate',
    user: null
  })
}

module.exports.users = async function(req, res) {
  const users = await User.find({})
  return res.status(200).json(users)
}