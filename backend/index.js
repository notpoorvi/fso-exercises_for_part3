require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person.js')
const morgan = require('morgan')
const cors = require('cors')
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        (tokens.method(req, res) == 'POST') ? JSON.stringify(req.body) : ''
    ].join(' ')
}))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => response.json(persons))
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => response.json(person))
})
app.get('/info', (request, response) => {
    const num_people = phonebook_data.length
    const time = new Date()
    response.send(`<div>Phonebook has info for ${num_people} people<div/>
        <br/>
        <div>${time}<div/>`
    )
})
app.post('/api/persons', (request, response) => {
    const body = request.body
    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save().then(savedPerson => response.json(savedPerson))
}
)
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id).then(result => {
        if (result) {
            response.status(204).end()
        } else {
            response.status(400).send("entry doesn't exist").end()
        }
    }).catch(error => next(error))
})
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.log(error.message)
    if (error.name == 'CastError') {
        return response.status(400).send("malformatted id")
    }
    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server starting on port ${PORT}`)
})