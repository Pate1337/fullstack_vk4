const mongoose = require('mongoose')

// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Gothubiin!
if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI
mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

let nimi, numero;

if (process.argv.length === 4) {
  nimi = process.argv[2]
  numero = process.argv[3]
  const person = new Person({
    name: nimi,
    number: numero
  })
  person
    .save()
    .then(response => {
      console.log('lisätään henkilö ', nimi, ' numero ', numero, ' luetteloon')
      mongoose.connection.close()
    })
} else if (process.argv.length === 2) {
  Person
  .find({})
  .then(result => {
    console.log('puhelinluettelo: ')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else {
  console.log('Pieleen meni')
  mongoose.connection.close()
}


  /*
  Person
  .find({})
  .then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })
  */
