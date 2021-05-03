const { ClientRequest } = require('http')
const net = require('net')
const dbData = require('./models/Data')

const clients = []
const dataServer = net.createServer((client) => {
  client.on('data', async (data) => {
    const req = data.toString().toLowerCase()
    console.log(req)
    const r = req.split(',')
    console.log(r)
    if (r[0] === 'zone') {
      const rt = await getZone(r[1])
      client.write(rt + ',!')
    } else if (r[0] === 'relay') {
      const rt = await getRelay(r[1])
      client.write(rt + ',!')
    }
  })

  client.on('end', () => {
    clients.splice(clients.indexOf(client), 1)
  })
})

async function getZone (id) {
  const r = await dbData.findOne({ id: id })
  if (r) {
    const zone = r.children.map(e => e.code)
    return zone.join(',')
  } else {
    return ''
  }
  
}

async function getRelay (id) {
  const r = await dbData.findOne({ id: id })
  if (r) {
    const relay = r.relay.map(e => e.code)
    return relay.join(',')
  } else {
    return ''
  }
}

dataServer.addListener('connection', (c) => {
  clients.push(c)
  c.write('connected data server')
})

async function startServer () {
  dataServer.listen(49999, () => {
    console.log('Start Data Server at 49999')
    dataServer.on('close', () => {
      console.log('Server Closed')
    })
  })
  dataServer.on('error', (err) => {
    console.log('Server Error: ', err)
  })
}

startServer()
