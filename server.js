require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express();

const Person = require('./mongo')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :data :status :res[content-length] - :response-time ms'))

morgan.token('data', function(req, res) {
  const { body } = req

  return JSON.stringify(body)
});

app.get('/info', (request, response) => {
  response.send(
    `
      <p>Phonebook has info for ${data.length} people</p>
      <p>${new Date()}</p>
    `
  )
})

// GET all phonebooks

app.get('/api/persons', (request, response) => {
  // response.json(data)
  Person.find({}).then((result) => {
    response.json(result)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then((result) => {
    if(result) {
      response.json(result)
    } else  {
      response.status(404).end()
    }
  })
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response) => {

  const body = request.body

  if(!body.name || !body.number) {
    return response.status(400).json({
      error: 'content-missing'
    })
  } 

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then((result) => {
    response.json(result)
  })
})


app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    body: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((result) => {
      res.json(result)
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ message: "unknown endpoint" })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.log(error)

  if(error === "CastError") {
    return res.status(400).send({ message: "malformatted id" })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server is up in port ${PORT}`)
})