const mongoose = require('mongoose')

if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI

mongoose.connect(url)

var Schema = mongoose.Schema
var personSchema = new Schema({ name: String, number: String })

const Person = mongoose.model('Person', personSchema)

personSchema.statics.format = function(person) {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

module.exports = Person
