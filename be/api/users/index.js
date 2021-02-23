const passport = require('passport')
const User = require('../../models/User')

module.exports.register = async function(req, res) {  
  const currentEmail = await User.findOne({ email: req.body.email })
  if (currentEmail !== null) {
    return res.status(500).json({ message: 'This email is already use' })
  }
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
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

module.exports.login = function(req, res, next) {
  console.log(req.body)
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err) }
    if (!user) { return res.status(403).json(info) }
    return req.login(user, (err) => {
      if (err) { return next(err) }
      return res.status(200).json({ user })
    })
  }) (req, res, next)
}

module.exports.loginKakao = function(req, res, next) {
  console.log('start kakao')
  passport.authenticate('kakao', (err, user, info) => {
    if (err) { return next(err) }
    if (!user) { return res.status(403).json(info) }
    return req.loginKakao(user, (err) => {
      if (err) { return next(err) }
      return res.status(200).json({ user })
    })
  }) (req, res, next)
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
  if (req.isAuthenticated() && req.user) {
    console.log(req.user)
    return res.status(200).json({ user: req.user });
  }
  return res.status(403).json({ user: null })
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