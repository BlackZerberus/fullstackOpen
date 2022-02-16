// imports
const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs')
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, password, name } = request.body
  if (!(username || password)) {
    return response.status(400).json({
      name: 'credentialsMissingError',
      message: 'check your username or password.'
    })
  }
  if (password.length < 3) {
    return response.status(400).json({
      name: 'passwordTooShortError',
      message: 'your password must have at least 3 characters'
    })
  }
  const passwordHash = await bcrypt.hash(password, 10)
  const newUser = new User({
    username,
    password: passwordHash,
    name
  })
  const result = await newUser.save()
  // console.log('nuevo usuario ', result)
  response.status(201).json(result)
})

module.exports = usersRouter
