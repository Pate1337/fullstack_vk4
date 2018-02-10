const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())

app.use(bodyParser.json())
app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))
app.use(express.static('build'))

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Martti Tienari',
    number: '040-123456',
  },
  {
    id: 3,
    name: 'Arto Järvinen',
    number: '040-123456',
  },
  {
    id: 4,
    name: 'Lea Kutvonen',
    number: '040-123456',
  }
]

morgan.token('data', function (req, res) {return JSON.stringify(req.body)})

morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.data(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
})

const formatPerson = (person) => {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({error: 'name or number missing'})
  }

  /*const alreadyExists = persons.find(person => body.name === person.name)*/

  Person
    .find({name: body.name})
    .then(person => {
      console.log(person[0])
      if (person[0]) {
        return response.status(400).json({error: 'name must be unique'})
      } else {
        const person = new Person({
          name: body.name,
          number: body.number
        })
        person
          .save()
          .then(savedPerson => {
            response.json(savedPerson)
          })
      }
    })
  /*console.log(alreadyExists)
  if (alreadyExists.name) {
    return response.status(400).json({error: 'name must be unique'})
  }*/

  /*const person = {
    name: body.name,
    number: body.number,
  }*/
  /*const person = new Person({
    name: body.name,
    number: body.number
  })*/

  /*persons = persons.concat(person)*/
  /*person
    .save()
    .then(savedPerson => {
      response.json(savedPerson)
    })*/

  /*response.json(person)*/
})

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons)
    })
})

app.get('/info', (req, res) => {
  const date = new Date()
  let size = 0
  Person
    .find({})
    .then(result => {
      result.forEach(person => {
        size = size + 1
        console.log(size)
      })
      res.send(`<p>puhelinluettelossa ${size} henkilön tiedot</p><p>${date}</p>`)
    })
})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(request.params.id, person, { new: true } )
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
