const mongoose = require('mongoose')


const argLength = process.argv.length

if(argLength < 3) {
    console.log('Pls, provide password')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://phonebook:${password}@cluster0.jy32x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String

})

const Person = mongoose.model('Person', personSchema)

if (argLength == 3) {
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
        process.exit(0)
    })
}

if(argLength == 5) {
    const name = process.argv[3]
    const number = process.argv[4]
    const person = new Person({
        name,
        number
    })
    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}
