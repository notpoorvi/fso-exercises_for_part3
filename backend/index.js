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
    const time = new Date()
    Person.find({}).then(result => response.send(`<div>Phonebook has info for ${result.length} people<div/>
        <br/>
        <div>${time}<div/>`
    ))

})
app.post('/api/persons', (request, response, next) => {
    const body = request.body
    Person.find({ name: body.name }).then(result => {
        if (result.length === 0) {
            const person = new Person({
                name: body.name,
                number: body.number
            })
            return person.save().then(savedPerson => response.json(savedPerson))
        }
        else {
            const existingPerson = result[0]
            const update = {
                name: existingPerson.name,
                number: body.number
            }
            Person.findByIdAndUpdate(existingPerson.id, update, { new: true }).then(updatedPerson => {
                return response.json(updatedPerson)
            }).catch(error => next(error))
        }
    }).catch(error => next(error))
}
)

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const update = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(request.params.id, update, { new: true }).then(updatedPerson => {
        return response.json(updatedPerson)
    }).catch(error => next(error))
})

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