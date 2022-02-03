import React from 'react'
import personService from '../services/Persons'

const deletePerson = (id, setPersons, setResults, setNotification) => {
  personService.clean(id)
  .then(async () => {
    const data = await personService.getAll()
    setPersons(data)
    setResults(data)
  })
  .catch(async () => {
    console.log('Error: The person that you tried to delete does not exists.')
    setNotification({type: 'error', message: 'The person that you tried to delete does not exists.'})
    const data = await personService.getAll()
    setPersons(data)
    setResults(data)
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  })
}

const Persons = ({data, setPersons, setResults, setNotification}) => {
  return (
    <ul>
        {data.map(person => <li key={person.id}>{person.name} {person.number} <button key={person.id} onClick={() => {window.confirm(`Delete ${person.name}?`) && deletePerson(person.id, setPersons, setResults, setNotification)}}>delete</button></li>)}
    </ul>
  )
}

export default Persons
