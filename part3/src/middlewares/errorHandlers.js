//errorHandler
const errorHandler = (error, req, res, next) => {
  const { name } = error
  if(name === 'CastError') return res.status(400).json({ name, error: 'malformatted id.' })
  else if (name === 'ValidationError') return res.status(400).json({ name, error: `${error.message}` })
  next(error)
}

module.exports = errorHandler