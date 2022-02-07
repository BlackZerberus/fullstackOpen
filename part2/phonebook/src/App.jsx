import React, {useState, useEffect} from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/Persons'
import Notification from './components/Notification'

const App = () => {
    const [ persons, setPersons ] = useState([])
    const [ newName, setNewName ] = useState('')
    const [ newPhone, setNewPhone ] = useState('')
    const [ search, setSearch] = useState('')
    const [ notification, setNotification ] = useState(null)

    useEffect(() => {
        personService.getAll()
        .then(persons => {
            setPersons(persons)
        })
    }, [])

    const addPerson = (event) => {
        event.preventDefault()
        console.log(event.target)
        const existsPerson = persons.find(person => person.name === newName)
        existsPerson
        ?window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
        && personService.update(existsPerson.id, {name: newName, number: newPhone})
            .then(async () => {
                const data = await personService.getAll()
                setPersons(data)
                setNewName('')
                setNewPhone('')
            })
            .catch(async (error) => {
                //console.log(error.response)
                const {name} = error.response.data
                const errorMsg = error.response.data.error
                if (name === 'ValidationError') setNotification({type: 'error', message: errorMsg})
                else setNotification({type: 'error', message: `Information of ${newName} has already been removed from server`})
                const data = await personService.getAll()
                setPersons(data)
                setNewName('')
                setNewPhone('')
                setTimeout(() => {
                    setNotification(null)
                }, 3000)
            })  
        :personService.create({name: newName, number: newPhone})
            .then(newPerson => {
                console.log(newPerson)
                personService.getAll()
                .then(updatedPersons => {
                    setPersons(updatedPersons)
                })
                setNewName('')
                setNewPhone('')
                setNotification({type: "success", message: `Added ${newName}`})
                setTimeout(() => {
                    setNotification(null)
                }, 3000)
            })
            .catch((error) => {
                setNotification({type: "error", message: `${error.response.data.error}`})
                setTimeout(() => {
                    setNotification(null)
                }, 5000)
                setNewName('')
                setNewPhone('')
            })
    }

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const handlePhoneChange = (event) => {
        setNewPhone(event.target.value)
    }

    const handleSearchChange = (event) => {
        setSearch(event.target.value)
        personService.searchByName(search)
        .then(result => {
            setPersons(result)
        })
    }
    
    const propsFilter = {value: search, fnChange: handleSearchChange}
    const propsPersonForm = {fnSubmit: addPerson, nameText: newName, fnName: handleNameChange, numberText: newPhone, fnNumber: handlePhoneChange}
    const propsPerson = {data: persons, setPersons, setNotification}
    return (
      <div>
        <Notification {...notification} />
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
