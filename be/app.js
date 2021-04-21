const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')

const history = require('connect-history-api-fallback')

const session = require('express-session')
const passport = require('passport')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)
const db = require('./db')
const server = require('./server')
const textServer = require('./textServer')

// require('./api/passport').config(passport)
const passportConfig = require('./api/passport')
require('dotenv').config()

const indexRouter = require('./routes/index')
const app = express()

app.use(cors({ origin: true, credentials: true }))
app.use(history())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
// app.use(cookieParser(process.env.COOKIE_SECRET))
// app.use(session({
//   resave: false,
//   saveUninitialized: false,
//   secret: process.env.COOKIE_SECRET,
//   cookie: {
//     httpOnly: true,
//     secure: false,
//     store: new MongoStore({ mongooseConnection: mongoose.connection, ttl: 60*60*24 })
//   }
// }))
passportConfig()
app.use(passport.initialize())

// app.use(passport.session())

app.use('/', indexRouter)


module.exports = app
