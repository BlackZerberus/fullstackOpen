import React from 'react'

const WeatherDisplay = ({weather}) => {
  return (
      <>
        <div><b>Temperature:</b> {weather.temperature} celsius</div>
        <img alt='weather_icon' src={weather.weather_icons[0]} />
        <div><b>wind:</b> {weather.wind_speed} mph direction {weather.wind_dir}</div>
      </>
  )
}

export default WeatherDisplay
