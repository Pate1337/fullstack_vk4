const mongoose = require('mongoose')

const url = 'mongodb://Pate1337:puhis123@ds229448.mlab.com:29448/fullstack-puhis'

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

module.exports = Person
