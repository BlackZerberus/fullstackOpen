import React, {useState, useEffect} from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/Persons'

const App = () => {
    const [ persons, setPersons ] = useState([])
    const [ newName, setNewName ] = useState('')
    const [ newPhone, setNewPhone ] = useState('')
    const [ search, setSearch] = useState('')
    const [ results, setResults] = useState([])

    useEffect(() => {
        personService.getAll()
        .then(persons => {
            setPersons(persons)
            setResults(persons)
        })
    }, [])

    const addPerson = (event) => {
        event.preventDefault()
        console.log(event.target)
        const existsPerson = persons.find(person => person.name === newName)
        existsPerson
        ?window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
        && personService.update(existsPerson.id, {name: newName, number: newPhone})
            .then(newPerson => {
                const data = persons.map(person => person.id !== newPerson.id?person:newPerson)
                setPersons(data)
                setResults(data)
                setNewName('')
                setNewPhone('')
            })  
        :personService.create({name: newName, number: newPhone})
            .then(newPerson => {
                setPersons([...persons, newPerson])
                setResults([...persons, newPerson])
                setNewName('')
                setNewPhone('')
            })
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
    const propsPerson = {data: results, setPersons, setResults}
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
