const express = require('express')
const app = express()
app.use(express.json())

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

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    phonebook_data = phonebook_data.filter(person => person.id !== id)
    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server starting on port ${PORT}`)
})