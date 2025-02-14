const express = require('express')
const app = express()
app.use(express.json())

const phonebook_data = [
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

app.get('/info', (request, response) => {
    const num_people = phonebook_data.length
    const time = new Date()
    response.send(`<div>Phonebook has info for ${num_people} people<div/>
        <br/>
        <div>${time}<div/>`
    )
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server starting on port ${PORT}`)
})