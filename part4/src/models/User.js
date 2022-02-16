// imports
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const { dbConnection } = require('../utils/config')

process.env.NODE_ENV !== 'test' && mongoose.connect(dbConnection)

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    length: 3
  },
  password: String,
  name: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      default: []
    }
  ]
})

mongoose.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    returnedObject.blogs = returnedObject.blogs.map(blog => blog.toString())
    delete returnedObject.password
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('User', userSchema)
