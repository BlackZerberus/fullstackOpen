import React, {useState, useEffect} from 'react'
import axios from 'axios'
import DisplayCountries from './components/DisplayCountries'

const App = () => {
    const [ countries, setCountries ] = useState([])
    const [ display, setDisplay] = useState([])
    const [ txtCountries, setTxtCountries] = useState('')
    useEffect(() => {
        axios.get('https://restcountries.com/v3.1/all')
        .then(response => {
            setCountries(response.data)
        })
    }, [])

    const handleTxtCountries = async (event) => {
        setTxtCountries(event.target.value)
        setDisplay(countries.filter(country => country.name.common.toLowerCase().includes(txtCountries.toLowerCase())))
    }

        const propsDisplayContries = {display, setDisplay}

    return (
        <div>
            <label htmlFor='txtCountries'>Find countries: </label>
            <input id='txtCountries' value={txtCountries} onChange={handleTxtCountries} />
            <DisplayCountries {...propsDisplayContries} />
        </div>
    )
}

export default App
