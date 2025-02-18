const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
app.use(cors())
app.use(express.static('dist'))
const app = express()
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

let phonebook_data = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(phonebook_data)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = phonebook_data.find(person => person.id === id)
    if (person) {
        response.json(person)
    }
    else {
        response.status(404).json({
            error: "person not found"
        }).end()
    }
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
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "empty request, name or number not defined"
        })
    }
    else if (phonebook_data.map(person => person.name).includes(body.name)) {
        return response.status(400).json({
            error: "name must be unique"
        })
    }
    else {
        const person = {
            id: Math.round(Math.random() * 10000),
            name: body.name,
            number: body.number
        }
        phonebook_data = phonebook_data.concat(person)
        response.json(person)
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    phonebook_data = phonebook_data.filter(person => person.id !== id)
    response.status(204).end()
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server starting on port ${PORT}`)
})