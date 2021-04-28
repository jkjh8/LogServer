const dbData = require('../../models/Data')

module.exports.getData = async function(req, res) {
  const items = await dbData.find({})
  return res.status(200).json({ data: items })
}

module.exports.addZone = async function(req, res) {
  const r = req.body
  let name
  if (r.name === '') {
    name = r.id
  }
  const zone = new dbData({
    id: r.id,
    name: r.name,
    code: r.code,
    children: r.children,
    relay: ''
  })
  await zone.save()
  const items = await dbData.find({})
  return res.status(200).json({ data: items })
}

module.exports.updateName = async function(req, res) {
  const r = req.body
  console.log(r)
  const rd = await dbData.update({ id: r.id }, { $set: { name: r.name, code: r.code } })
  console.log(rd)
  const items = await dbData.find({})
  return res.status(200).json({ data: items })
}

module.exports.updateZone = async function(req, res) {
  const id = req.body.id
  const zone = req.body.zone
  console.log(id, zone)

  const r = await dbData.update({ id: id }, { $set: { children: zone } })
}