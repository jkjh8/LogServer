const express = require('express')
const router = express.Router()
const passport = require('passport')

const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ path: path.join(__dirname, '../.env') })

const users = require('../api/users')

/* GET users listing. */
router.post('/auth/local/register', users.register)
router.post('/auth/local', users.login)
router.get('/auth/logout', users.logout)
router.get('/auth/user', users.user)
router.get('/auth/refresh', users.refresh)
router.get('/auth/kakao', users.loginKakao)
router.get('/auth/kakao/callback', passport.authenticate("kakao", { failureRedirect: "/login" }), (req, res) => {res.redirect("/") })
router.get('/auth/kakaokey', (req, res) => {
  console.log(process.env.KAKAO_ID)
  res.status(200).json({ key: process.env.KAKAO_ID })
})

router.get('/auth/google', users.loginGoogle)

router.get('/auth/google/callback', 
passport.authenticate('google', { failureRedirect: '/login' }),
function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('/');
})

module.exports = router;
