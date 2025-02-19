const mongoose = require("mongoose")
if (process.argv.length < 3) {
    console.log("give password as argument")
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
    `mongodb+srv://poorvib26:${password}@cluster0.dxwda.mongodb.net/phoneBookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = {
    name: String,
    number: String
}

const Person = mongoose.model('Person', personSchema)

if (process.argv.length >= 5) {
    const personEntered = new Person({
        name: name,
        number: number
    })

    personEntered.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}
else {
    Person.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(item => console.log(`${item.name} ${item.number}`))
        mongoose.connection.close()
    })
}