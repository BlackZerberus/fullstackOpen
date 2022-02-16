const { getUsers } = require('../src/utils/helper')
const mongoose = require('mongoose')
const User = require('../src/models/User')
const Blog = require('../src/models/Blog')
const app = require('../src/app')
const superTest = require('supertest')
const { dbConnection } = require('../src/utils/config')
const bcrypt = require('bcrypt')

const api = superTest(app)

beforeAll(async () => {
  await mongoose.connect(dbConnection)
})

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})
  const pass1 = await bcrypt.hash('password1', 10)
  const user1 = await new User({
    username: 'test1',
    password: pass1,
    name: 'test 1'
  }).save()
  // console.log('user1 default ', user1)
  const pass2 = await bcrypt.hash('password2', 10)
  const user2 = await new User({
    username: 'test2',
    password: pass2,
    name: 'test 2'
  }).save()
  // console.log('user2 default ', user2)
  const blog1 = await new Blog({
    title: 'blog 1',
    author: 'test 1',
    url: 'url1',
    likes: 4,
    user: user1._id
  }).save()
  user1.blogs = user1.blogs.concat(blog1._id)
  await user1.save()
  const blog2 = await new Blog({
    title: 'blog 2',
    author: 'test 1',
    url: 'url2',
    likes: 6,
    user: user1._id
  }).save()
  user1.blogs = user1.blogs.concat(blog2._id)
  await user1.save()
  const blog3 = await new Blog({
    title: 'blog 3',
    author: 'test 2',
    url: 'url3',
    likes: 1,
    user: user2._id
  }).save()
  user2.blogs = user2.blogs.concat(blog3._id)
  await user2.save()
})

describe('testing GET on /api/users', () => {
  test('Getting all users', async () => {
    const response = await api.get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    console.log(response.body.map(user => user.blogs))
    expect(response.body.length).toBe(2)
    expect(response.body).toEqual(await getUsers())
  })
})

describe('testing POST on /api/users', () => {
  test('Inserting a new valid User', async () => {
    const newUser = {
      username: 'newUser',
      password: 'password',
      name: 'New User'
    }
    const response = await api.post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    delete newUser.password
    delete response.body.id
    expect(response.body).toEqual(newUser)
    expect((await getUsers()).length).toBe(4)
  })

  test('Inserting a null username & password user', async () => {
    const newUser = {
      username: null,
      password: null,
      name: 'wrong user'
    }
    const response = await api.post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(response.body).toEqual({
      name: 'credentialsMissingError',
      message: 'check your username or password.'
    })
  })

  test('Inserting a password with less than 3 chars', async () => {
    const newUser = {
      username: 'PaswordToShort',
      password: 'no',
      name: 'Test'
    }
    const response = await api.post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-type', /application\/json/)

    expect(response.body).toEqual({
      name: 'passwordTooShortError',
      message: 'your password must have at least 3 characters'
    })
  })

  test('Inserting a username that already exists', async () => {
    const newUser = {
      username: 'LordTulioBestBlogger',
      password: 'password',
      name: 'test'
    }
    const response = await api.post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(response.body).toEqual({ name: 'ValidationError', message: 'user name must be unique.' })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
