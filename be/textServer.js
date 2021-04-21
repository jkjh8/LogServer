const dbLogs = require('./models/Logs')
const dgram = require('dgram')
const textServer = dgram.createSocket('udp4')
const zones = require('./Zone.json')

const PORT = 9999
const HOST = '0.0.0.0'

textServer.on('listening', function () {
  const address = textServer.address()
  const startLog = new dbLogs({
    source: 'LogServer',
    category: 'Info',
    zones: ['방송센터'],
    message: `Text Server UDP Listening Started at ${address.address}:${address.port}`
  })
  startLog.save()
  console.log('text server start!!!')
})

textServer.on('message', function(msg, remote) {
  try {
    const message = msg.toString().split(',')
    const logMsg = new dbLogs({
      source: zones[message[0]].name,
      category: 'info',
      zones: [zones[message[0]].name],
      message: message[1]
    })
    logMsg.save()
  } catch (err) {
    console.error(err)
  }
})

textServer.bind(PORT, HOST)

module.exports = textServer
