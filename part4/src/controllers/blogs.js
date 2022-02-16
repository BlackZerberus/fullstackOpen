// imports
const blogRouter = require('express').Router()
const Blog = require('../models/Blog')
const User = require('../models/User')
const { getAndValidateToken, onlyOwnerAuth } = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

blogRouter.post('/', getAndValidateToken, async (request, response) => {
  const { user } = request
  const { title, url } = request.body
  if (!(title && url)) return response.status(400).json({ name: 'missingValueError', message: 'One or many values are missing' })
  const dbUser = await User.findById(user.id)
  const savedBlog = await new Blog({ ...request.body, user: user.id }).save()
  dbUser.blogs = dbUser.blogs.concat(savedBlog._id)// [...dbUser.blogs, result._id]
  await dbUser.save()
  return response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', getAndValidateToken, onlyOwnerAuth, async (request, response) => {
  const { id } = request.params
  const result = await Blog.findByIdAndDelete(id)
  console.log('result: ', result)
  return response.json(result)
})

blogRouter.put('/:id', getAndValidateToken, onlyOwnerAuth, async (request, response) => {
  const { id } = request.params
  const { likes } = request.body
  const result = await Blog.findByIdAndUpdate(id, { likes }, { new: true })
  if (!result) return response.status(404).json({ name: 'noDataError', message: 'the blog does not exists' })
  return response.json(result)
})

module.exports = blogRouter
