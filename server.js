const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express();

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :data :status :res[content-length] - :response-time ms'))

morgan.token('data', function(req, res) {
  const { body } = req

  return JSON.stringify(body)
});

let data = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const generateId = () => {
  const maxId = data.length > 0 ? Math.max(...data.map((person) => person.id)) : 0
  return maxId + 1
}

app.get('/api/persons', (request, response) => {
  response.json(data)
})

app.get('/info', (request, response) => {
  response.send(
    `
      <p>Phonebook has info for ${data.length} people</p>
      <p>${new Date()}</p>
    `
  )
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = data.find((person) => person.id === id)

  if(person) {
    response.json(person)
  } else  {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  data = data.filter((person) => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {

  const body = request.body

  const dupName = data.find((person) => person.name === body.name)

  if(!body.name || !body.number) {
    return response.status(400).json({
      error: 'content-missing'
    })
  } 

  if(dupName) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  data = data.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server is up in port ${PORT}`)
})