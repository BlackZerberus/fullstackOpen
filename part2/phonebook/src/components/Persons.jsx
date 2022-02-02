import React from 'react'
import personService from '../services/Persons'

const deletePerson = (id, setPersons, setResults) => {
  personService.clean(id)
  .then(async () => {
    const data = await personService.getAll()
    setPersons(data)
    setResults(data)
  })
}

const Persons = ({data, setPersons, setResults}) => {
  return (
    <ul>
        {data.map(person => <li key={person.id}>{person.name} {person.number} <button key={person.id} onClick={() => {window.confirm(`Delete ${person.name}?`) && deletePerson(person.id, setPersons, setResults)}}>delete</button></li>)}
    </ul>
  )
}

export default Persons
