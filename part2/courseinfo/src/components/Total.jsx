import React from 'react'

const Total = ({parts}) => {
  return <p><b>Total of {parts.reduce((total, part) => total + part.exercises, 0)} exercises</b></p>
}

export default Total
