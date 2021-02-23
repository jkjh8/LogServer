const mongoose = require('mongoose')
const dbLogs = require('./models/Logs')

mongoose.connect('mongodb://localhost/logserver', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
  connectTimeoutMS: 1000
})

const db = mongoose.connection

db.on('error', console.error.bind(console, 'db Connection Error:'))

db.once('open', () => {
  console.log('MongoDB connected...')
})

db.once('open', () => {
  const startLog = new dbLogs({
    source: 'LogServer',
    category: 'Info',
    zones: '방송센터',
    message: 'Log Server Started!'
  })
  startLog.save()
  console.log('MongoDB connected...')
})

module.exports = db
