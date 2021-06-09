const dbLogs = require('../../models/Logs')
const moment = require('moment')
const fs = require('fs')
const xlsx = require('xlsx')
const e = require('express')

module.exports.getlog = function(req, res) {
  const searchKeyword = req.query.search
  const options = {
    page: req.query.page,
    limit: req.query.limit,
    sort: { date: -1 }
  }
  if (req.query.zones !== 'undefined' && searchKeyword) {
    const zones = req.query.zones.split(',')
    dbLogs.paginate({ $and: [{ zones: { $in: zones } }, { $text: { $search: searchKeyword }}] }, options, (err, result) =>{
      if (err) {
        return res.status(500).json({ status: 'Error' })
      }
      return res.status(200).json(result)
    })
  } else if (req.query.zones !== 'undefined') {
    const zones = req.query.zones.split(',')
    dbLogs.paginate({ zones: { $in: zones }}, options, (err, result) =>{
      if (err) {
        return res.status(500).json({ status: 'Error' })
      }
      return res.status(200).json(result)
    })
  } else if (searchKeyword) {
    dbLogs.paginate({ $text: { $search: searchKeyword }}, options, (err, result) =>{
      if (err) {
        return res.status(500).json({ status: 'Error' })
      }
      return res.status(200).json(result)
    })
  } else {
    dbLogs.paginate({}, options, (err, result) =>{
      if (err) {
        return res.status(500).json({ status: 'Error' })
      }
      return res.status(200).json(result)
    })
  }
}

function logObjToSheet (docs) {
  const msg = []
  docs.forEach(logMsg => {
    msg.push({
      date: moment(logMsg.date).format(),
      priority: logMsg.priority,
      category: logMsg.category,
      source: logMsg.source,
      zones: logMsg.zones.join(','),
      message: logMsg.message
    })
  })
  return xlsx.utils.json_to_sheet(msg)
}

module.exports.getlogcsv = async function(req, res) {
  console.log(req.query)
  let docs
  if (req.query.all === 'true') {
    docs = await dbLogs.find({ date: { $gte: req.query.start, $lt: req.query.end } })
  } else {
    const zones = req.query.zones.split(',')
    docs = await dbLogs.find({
      $and: [{ zones: { $in: zones } }, { date: { $gte: req.query.start, $lt: req.query.end } }]
    })
  }
  
  const sheet = await logObjToSheet(docs)
  const stream = await xlsx.stream.to_csv(sheet)
  
  res.setHeader("Content-disposition", "attachment; filename=log.csv")
  res.set('Content-Type', 'text/csv')

  stream.pipe(res).on('finish', () => {
    console.log('download complete')
  })
}

module.exports.getbackup = async function (req, res) {
  const docs = await dbLogs.find({})
  const sheet = await logObjToSheet(docs)
  const stream = await xlsx.stream.to_csv(sheet)
  
  res.setHeader("Content-disposition", "attachment; filename=log.csv")
  res.set('Content-Type', 'text/csv')

  stream.pipe(res).on('finish', () => {
    console.log('download complete')
  })
}

module.exports.dellog = async function (req, res) {
  const result = await dbLogs.deleteMany({})
  res.status(200).json({ result: 'success' })
}

module.exports.uploadlog = async function(req, res) {
  const data = new dbLogs({
    source: req.body.source,
    priority: req.body.priority,
    category: req.body.category,
    zones: req.body.zones,
    message: req.body.message
  })

  data.save((err) => {
    if (err) {
      return res.status(500).json({ status: 'Error' })
    }
    res.status(200).json({ status:'Success' })
  })
}

module.exports.uploadlogId = async function(req, res) {
  const data = new dbLogs({
    source: zones[req.body.source],
    priority: req.body.priority,
    category: req.body.category,
    zones: zones[req.body.zones],
    message: req.body.message
  })

  data.save((err) => {
    if (err) {
      return res.status(500).json({ status: 'Error' })
    }
    res.status(200).json({ status:'Success' })
  })
}