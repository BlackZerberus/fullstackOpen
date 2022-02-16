// imports
const express = require('express')
const app = express()
const cors = require('cors')
require('express-async-errors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const { unknownEndpoint, errorHandler } = require('./utils/middleware')

app.use(cors())
app.use(express.json())
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
