import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
    const [ persons, setPersons ] = useState([])
    const [ newName, setNewName ] = useState('')
    const [ newPhone, setNewPhone ] = useState('')
    const [ search, setSearch] = useState('')
    const [ results, setResults] = useState([])

    useEffect(() => {
        axios.get('http://localhost:3001/persons')
        .then(res => {
            setPersons(res.data)
            setResults(res.data)
        })
    }, [])

    const addPerson = (event) => {
        event.preventDefault()
        console.log(event.target)
        persons.some(person => person.name === newName)
        ?alert(`${newName} is already added to phonebook`)  
        :setPersons([...persons, {name: newName, number: newPhone}])
        setNewName('')
        setNewPhone('')
    }

    const handleNameChange = (event) => {
        console.log(event.target.value)
        setNewName(event.target.value)
    }

    const handlePhoneChange = (event) => {
        setNewPhone(event.target.value)
    }

    const handleSearchChange = (event) => {
        setSearch(event.target.value)
        setResults(persons.filter(person => person.name.toLowerCase().includes(search)))
    }
    
    const propsFilter = {value: search, fnChange: handleSearchChange}
    const propsPersonForm = {fnSubmit: addPerson, nameText: newName, fnName: handleNameChange, numberText: newPhone, fnNumber: handlePhoneChange}
    const propsPerson = {data: results}
    return (
      <div>
        <h2>Phonebook</h2>
        <div>
            <Filter {...propsFilter} />
        </div>
        <h2>Add a new</h2>
            <PersonForm {...propsPersonForm} />
        <h2>Numbers</h2>
            <Persons {...propsPerson} />
      </div>
    )
  }
  
  export default App
