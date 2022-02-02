import React, {useState, useEffect} from 'react'
import axios from 'axios'
import WeatherDisplay from './WeatherDisplay'

const DisplayCountries = ({display, setDisplay}) => {
    
    const [ weather, setWeather ] = useState({})
    const apiKey = process.env.REACT_APP_WEATHERSTACK_API_KEY

    useEffect(() => {
        (display.length === 1) && axios.get(`http://api.weatherstack.com/current?access_key=${apiKey}&query=${display[0].capital[0]}`)
            .then(response => {
                console.log("resolving promise")
                console.log(response)
                const {current} = response.data
                setWeather(current)
                console.log(current)
            })
    }, [apiKey, display])

    if (display.length > 10) {
        return <p>Too many matches, specify another filter.</p>
    }
    if (display.length === 1) {
        const country = display[0]
        return (
            <>
                <h2>{country.name.common}</h2>
                <div>capital {country.capital[0]}</div>
                <div>population {country.population}</div>
                <h3>Languages</h3>
                <ul>
                    {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
                </ul>
                <img alt='country_flag' src={country.flags.png} style={{border: '1px solid black'}} />
                <h2>Weather in {country.capital[0]}</h2>
                {weather?.temperature  && <WeatherDisplay weather={weather} />}
            </>
        )
    }
    return (
        <ul>
            {display.map(country => {
                return <li key={country.cca3}>{country.name.common}<button onClick={()=>{setDisplay([country])}}>show</button></li>
            })}
        </ul>
    )
};

export default DisplayCountries
