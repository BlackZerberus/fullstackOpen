// imports
const mongoose = require('mongoose')
// const uniqueValidator = require('mongoose-unique-validator')
const { dbConnection } = require('../utils/config')

// const mongoUrl = 'mongodb+srv://fullstack:OTW7kcz43wtGcW2i@cluster0.4ibpr.mongodb.net/bloglist?retryWrites=true&w=majority'
process.env.NODE_ENV !== 'test' && mongoose.connect(dbConnection)

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

// mongoose.plugin(uniqueValidator)

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    returnedObject.user = returnedObject.user.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)
