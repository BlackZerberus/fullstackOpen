require('dotenv').config()

const { PORT, NODE_ENV, MONGODB_URI, TEST_MONGODB_URI } = process.env
const dbConnection = NODE_ENV === 'test' ? TEST_MONGODB_URI : MONGODB_URI

module.exports = {
  PORT,
  dbConnection
}
