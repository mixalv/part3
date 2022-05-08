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
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: value => /^(\d{2}-?\d{6,})$|^(\d{3}-?\d{5,})$/.test(value),
      message: props => `number ${props.value} has incorrect format`
    }
  }

})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)

