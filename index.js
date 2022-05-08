require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  
  next(error)
}



const app = express()

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :total-time[0] - :response-time ms :body'))

app.get('/api/persons', (request, response)=> {
  Person.find({}).then(persons=>{
    response.json(persons)
  })

    
})

app.get('/api/persons/:id', (request, response, next)=> {
  const id = request.params.id
  Person.findById(id)
    .then(person=> {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      } 
    })
    .catch(error => next(error))
    
})

app.delete('/api/persons/:id', (request, response, next)=> {
  const id = request.params.id
  Person.findByIdAndRemove(id).then( result => {
    response.status(204).end()
  })
    .catch(error => next(error))
})

app.get('/info', (request, response, next)=> {
  Person.find({}).then(persons=>{
    const quantity = persons.length
    const date = new Date()
    response.send(
      `<p>Phonebook has info for ${quantity} people</p>
            <p>${date}</p>`
    )
  })
    .catch(error => next(error))
    

})

app.post('/api/persons', (request, response, next)=> {
  Person.find({}).then(persons=> {

    if(persons.some(person => person.name.toLowerCase() === request.body.name.toLowerCase())) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    }
    const person = new Person({
      name: request.body.name,
      number: request.body.number
    }) 
    person.save().then(savedPerson=>{
      response.json(savedPerson)
    })
      .catch(error => next(error))
  })
})

app.put('/api/persons/:id', (request, response, next)=> {
  const person = request.body
  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))

})

app.use(errorHandler)
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
  

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})