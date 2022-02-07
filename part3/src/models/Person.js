const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGO_URI
console.log(`conecting to ${url}...`)

mongoose.connect(url)
  .then(() => {
    console.log('conected to mongoDB')
  })
  .catch(error => {
    console.log('Error conecting to mongoDB: ', error.message)
  })

const personSchema = mongoose.Schema({
  name: { type: String, required: true, minlength: 3, unique: true },
  number: { type: String, required: true, minlength: 8 }
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)