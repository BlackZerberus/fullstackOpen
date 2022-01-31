import React from 'react'

const Persons = ({data}) => {
  return (
    <ul>
        {data.map(person => <li key={person.id}>{person.name} {person.number}</li>)}
    </ul>
  )
}

export default Persons
