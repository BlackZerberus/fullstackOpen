// imports
require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/Person')
const errorHandlers = require('./middlewares/errorHandlers')

// middlewares before endpoints
app.use(express.json())
app.use(express.static('build'))
app.use(cors())
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// endpoints
app.get('/api/persons', (req, res) => {
  const { name } = req.query
  if (name) return Person.find({ name: new RegExp(`^${name}`, 'i') })
    .then(results => {
      res.json(results)
    })
  return Person.find({})
    .then(persons => {
      res.json(persons)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
  const { id } = req.params
  Person.findById(id)
    .then(person => {
      res.status(200).json(person)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body
  console.log(req.body)
  if (!name || !number) return res.status(400).json({ error: 'content missing' })
  const person = new Person({ name, number })
  return person.save()
    .then(savedPerson => {
      res.status(201).json(savedPerson)
    })
    .catch(error => {
      next(error)
    })
})

app.put('/api/persons/:id', (req, res, next) => {
  const { id } = req.params
  const { number } = req.body
  Person.findByIdAndUpdate(id, { number }, { runValidators: true })
    .then(person => res.status(200).json(person))
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res) => {
  const { id } = req.params
  //persons = persons.filter(person => person.id !== Number(id))
  Person.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end()
    })
})

app.get('/info', (req, res) => {
  Person.find({})
    .then(persons => {
      const body = `<div>Phonebook has info for ${persons.length} people</div><div>${new Date()}</div>`
      res.send(body)
    })
    .catch(error => res.status(500).json({ error: error }))
})

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown endpoint' })
}

// middlewares after endpoints
app.use(unknownEndpoint)
app.use(errorHandlers)

// port
const port = process.env.PORT ?? 3001
app.listen(port, () => console.log(`server running on port ${port}`))