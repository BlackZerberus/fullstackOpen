const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/User')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body
  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.password)
  if (!(user && passwordCorrect)) {
    return response.status(401)
      .json({ error: 'invalid username or password.' })
  }

  const userInfo = {
    username: user.username,
    id: user._id.toString()
  }

  const token = jwt.sign(userInfo, process.env.SECRET)
  response.json({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
