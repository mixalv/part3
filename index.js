require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


const app = express()

morgan.token('body', (req) => {
    return JSON.stringify(req.body)
})

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :total-time[0] - :response-time ms :body'))

let persons = [
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

app.get('/api/persons', (request, response)=> {
    Person.find({}).then(persons=>{
        response.json(persons)
    })
    
})

app.get('/api/persons/:id', (request, response)=> {
    const id = Number(request.params.id)
    Person.findById(id).then(person=> {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        } 
    })
    
})

app.delete('/api/persons/:id', (request, response)=> {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.get('/info', (request, response)=> {
    const quantity = persons.length
    const date = new Date()
    response.send(
        `<p>Phonebook has info for ${quantity} people</p>
        <p>${date}</p>`
    )

})

app.post('/api/persons', (request, response)=> {
    if (!request.body.name || !request.body.number) {
        return response.status(400).json({
            error: 'name and number must be filled'
        })
    }

    if(persons.some(person => person.name.toLowerCase() === request.body.name.toLowerCase())) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    const person = new Person({
        name: request.body.name,
        number: request.body.number
    }) 
   person.save(person).then(savedPerson=>{
        response.json(savedPerson)
   })
   
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})