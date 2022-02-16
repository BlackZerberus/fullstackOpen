const { dummy } = require('../src/utils/helper')

test('Dummy returns one', () => {
  const blogs = []
  const result = dummy(blogs)
  expect(result).toBe(1)
})
