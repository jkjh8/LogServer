const dbLogs = require('./models/Logs')
const dgram = require('dgram')
const server = dgram.createSocket('udp4')

const PORT = 59999
const HOST = '0.0.0.0'

server.on('listening', function () {
  const address = server.address()
  const startLog = new dbLogs({
    source: 'LogServer',
    category: 'Info',
    zones: ['방송센터'],
    message: `Log Server UDP Listening Started at ${address.address}:${address.port}`
  })
  startLog.save()
  console.log('log server start!!!')
})

server.on('message', function(msg, remote) {
  try {
    const msgObj = JSON.parse(msg)
    console.log(msgObj)
    // const zones = msgObj.split(',')
    const logMsg = new dbLogs({
      source: msgObj.source,
      category: msgObj.category,
      zones: msgObj.zones,
      message: msgObj.message
    })
    logMsg.save()
  } catch (err) {
    console.error(err)
  }
})

server.bind(PORT, HOST)

module.exports = server
