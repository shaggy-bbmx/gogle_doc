const mongoose = require('mongoose')

const Document = new mongoose.Schema({
    _id: String,
    name: String,
    data: Object
})

const document = mongoose.model('Document', Document)
module.exports = document

