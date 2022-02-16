const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../src/app')
const Blog = require('../src/models/Blog')
const User = require('../src/models/User')
const { getBlogs } = require('../src/utils/helper')
const bcrypt = require('bcrypt')
const { dbConnection } = require('../src/utils/config')

const api = supertest(app)

beforeAll(async () => {
  await mongoose.connect(dbConnection)
})

beforeEach(async () => {
  // const promises = null
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

describe('Testing the GET /api/blogs endpoint', () => {
  test('there are 3 blogs', async () => {
    const response = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    console.log(response.body)
    expect(response.body).toHaveLength(3)
  })

  test('id property has to be defined', async () => {
    const response = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body[0].id).toBeDefined()
  })
})

describe('Testing the POST /api/blogs endpoint', () => {
  test('add a new blog', async () => {
    const [user] = await User.find({ name: 'test 2' })
    // console.log(user)
    const newBlog = {
      title: 'blog 4',
      author: user.name,
      url: 'url4',
      likes: 5,
      user: user._id
    }
    // console.log('newBlog: ', newBlog)
    const BeforeSave = await getBlogs()
    const credential = await api.post('/api/login')
      .send({ username: 'test1', password: 'password1' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const { token } = credential.body
    console.log('Token ', token)
    const response = await api.post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `Bearer ${token}` })
      .expect(201)
      .expect('Content-type', /application\/json/)
    const [blog] = await Blog.find({ title: 'blog 4' })
    expect(response.body).toEqual(blog.toJSON())
    expect((await getBlogs()).length).toBe(BeforeSave.length + 1)
  })

  test('checks if likes default property works', async () => {
    const [user] = await User.find({ name: 'test 2' })
    const newBlog = {
      title: 'test title',
      author: user.name,
      url: 'someurl',
      user: user._id
    }

    const response = await api.post('/api/blogs').send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(response.body.likes).toBeDefined()
    expect(response.body.likes).toBe(0)
  })

  test('checks if title and url properties are missing responds with a 400', async () => {
    const [user] = await User.find({ name: 'test 2' })
    const newBlog = {
      author: 'tester',
      user: user._id
    }

    const response = await api.post('/api/blogs').send(newBlog)
      .expect(400)
      .expect('Content-type', /application\/json/)
    expect(response.body).toEqual({ name: 'missingValueError', message: 'One or many values are missing' })
  })
})

describe('testing DELETE in /api/blogs endpoint', () => {
  test('deleting a registered blog', async () => {
    let [blog] = await Blog.find({ title: 'blog 1' })
    blog = blog.toJSON()
    const credential = await api.post('/api/login')
      .send({ username: 'test1', password: 'password1' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const { token } = credential.body
    const response = await api.delete(`/api/blogs/${blog.id}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body).toEqual(blog)
  })

  test('deleting a non existing blog with a valid id', async () => {
    const credential = await api.post('/api/login')
      .send({ username: 'test1', password: 'password1' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const { token } = credential.body
    const response = await api.delete('/api/blogs/62029f0f4042fff25c93e8d5')
      .set({ Authorization: `Bearer ${token}` })
      .expect(404)
      .expect('Content-Type', /application\/json/)
    expect(response.body).toEqual({ error: 'the blog does not exists.' })
  })

  test('deleting a non existing blog with a invalid id', async () => {
    const credential = await api.post('/api/login')
      .send({ username: 'test1', password: 'password1' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const { token } = credential.body
    const response = await api.delete('/api/blogs/thisidisnotvalid')
      .set({ Authorization: `Bearer ${token}` })
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(response.body).toEqual({ name: 'CastError', message: 'id has an incorrect format' })
  })
})

describe('Testing PUT in /api/blogs', () => {
  test('updating likes into a valid blog id', async () => {
    const credential = await api.post('/api/login')
      .send({ username: 'test1', password: 'password1' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const { token } = credential.body
    let [blog] = await Blog.find({ title: 'blog 1' })
    blog = blog.toJSON()
    blog.likes = 100
    const response = await api.put(`/api/blogs/${blog.id}`)
      .send({ likes: blog.likes })
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body).toEqual(blog)
  })

  test('updating a non existing blog with a valid id', async () => {
    const credential = await api.post('/api/login')
      .send({ username: 'test1', password: 'password1' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const { token } = credential.body
    const response = await api.put('/api/blogs/62029f0f4042fff25c93e8d5')
      .send({})
      .set({ Authorization: `Bearer ${token}` })
      .expect(404)
      .expect('Content-Type', /application\/json/)
    expect(response.body).toEqual({ error: 'the blog does not exists.' })
  })

  test('updating a non existing blog with a invalid id', async () => {
    const credential = await api.post('/api/login')
      .send({ username: 'test1', password: 'password1' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const { token } = credential.body
    const response = await api.put('/api/blogs/thisidisnotvalid')
      .send({})
      .set({ Authorization: `Bearer ${token}` })
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(response.body).toEqual({ name: 'CastError', message: 'id has an incorrect format' })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
