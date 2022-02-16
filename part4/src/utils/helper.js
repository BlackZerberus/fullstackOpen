// imports
const _ = require('lodash')
const Blog = require('../models/Blog')
const User = require('../models/User')

// functions
const dummy = blogs => 1

const totalLikes = blogs => blogs.reduce((total, blog) => total + blog.likes, 0)

const favoriteBlog = blogs => {
  const { title, author, likes } = blogs.sort((a, b) => b.likes - a.likes)[0]
  return { title, author, likes }
}

const mostBlogs = data => {
  const authors = _.countBy(data, blog => blog.author)
  const arrayAuthors = Object.entries(authors)
  const [author, blogs] = arrayAuthors.sort((a, b) => b[1] - a[1])[0]
  return { author, blogs }
}

const mostLikes = data => {
  const groups = _.groupBy(data, blog => blog.author)
  for (const author in groups) {
    groups[author] = groups[author].reduce((total, author) => total + author.likes, 0)
  }
  const [author, likes] = Object.entries(groups).sort((a, b) => b[1] - a[1])[0]
  return { author, likes }
}

const blogs = [
  { title: 'React patterns', author: 'Michael Chan', url: 'https://reactpatterns.com/', likes: 7 },
  { title: 'Go To Statement Considered Harmful', author: 'Edsger W. Dijkstra', url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html', likes: 5 },
  { title: 'Canonical string reduction', author: 'Edsger W. Dijkstra', url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html', likes: 12 },
  { title: 'First class tests', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll', likes: 10 },
  { title: 'TDD harms architecture', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html', likes: 0 },
  { title: 'Type wars', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html', likes: 2 }
]

const getBlogs = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const getBlogsByAuthor = async (name) => {
  const { _id } = await User.find({ author: name })
  const colection = await Blog.find({ user: _id })
  return colection.map(blog => blog.toJSON())
}

const users = [
  {
    userName: 'MiChan',
    password: 'tulio123',
    name: 'Michael Chan'
  },
  {
    userName: 'EdDij',
    password: 'lanotaverde123',
    name: 'Edsger W. Dijkstra'
  },
  {
    userName: 'RMartin',
    password: 'estamosalaire',
    name: 'Robert C. Martin'
  }
]

const getUsers = async () => {
  const users = await User.find({}).populate('blogs')
  return users.map(user => user.toJSON())
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes, blogs, users, getUsers, getBlogsByAuthor, getBlogs }
