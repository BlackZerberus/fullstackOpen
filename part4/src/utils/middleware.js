// imports
const jwt = require('jsonwebtoken')
const Blog = require('../models/Blog')
const User = require('../models/User')

const unknownEndpoint = (req, res) => res.status(404).json({ name: 'UnknownEndpoint', message: 'unknown endpoint' })

const errorHandler = (error, req, res, next) => {
  console.error(error.toString())
  if (error.name === 'CastError') return res.status(400).json({ name: error.name, message: 'id has an incorrect format' })
  else if (error.name === 'ValidationError') return res.status(400).json({ name: error.name, message: 'user name must be unique.' })
  res.status(400).end()
  next(error)
}

const getAndValidateToken = (request, response, next) => {
  const authorization = request.get('Authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    const token = authorization.substring(7)
    request.user = jwt.verify(token, process.env.SECRET)
    next()
    return
  }
  response.status(401).json({ error: 'Authorization header not found or malformatted' })
  console.error({ error: 'Authorization header not found or malformatted' })
}

const onlyOwnerAuth = async (request, response, next) => {
  const blogId = request.params.id
  const { user } = request
  const owner = await User.findById(user.id)
  const checkBlog = await Blog.findById(blogId)
  console.log(checkBlog)
  if (!checkBlog) {
    response.status(404).json({ error: 'the blog does not exists.' })
    return
  } else if (owner.blogs.some(blog => blog.toString() === blogId)) {
    next()
    return
  }
  response.status(403).json({ error: 'you have not authorization for delete this resource' })
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  getAndValidateToken,
  onlyOwnerAuth
}
