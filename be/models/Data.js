const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: { type: String },
  children: { type: Array }
})

const Data = mongoose.model('Data', dataSchema)

module.exports = Data
