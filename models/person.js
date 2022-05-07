const mongoose = require('mongoose')

const url = process.env.MONGO_URI


mongoose.connect(url)
    .then(result=>{
        console.log('connected to db')
    })
    .catch(error=> {
        console.log('error connecting to the db', error.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String

})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
    }
  })

module.exports = mongoose.model('Person', personSchema)

