'use client'

import { useEffect, useState } from 'react'

export const Weather = ({
  latitude,
  longitude,
  generationtime_ms,
  utc_offset_seconds,
  timezone,
  timezone_abbreviation,
  elevation,
  current_units,
  current,
  hourly_units,
  hourly,
  daily_units,
  daily,
}) => {
  const [weatherData, setWeatherData] = useState(null)

  useEffect(() => {
    // Fetch weather data or perform any necessary operations
    // Example:
    setWeatherData({
      latitude,
      longitude,
      generationtime_ms,
      utc_offset_seconds,
      timezone,
      timezone_abbreviation,
      elevation,
      current_units,
      current,
      hourly_units,
      hourly,
      daily_units,
      daily,
    })
  }, [
    latitude,
    longitude,
    generationtime_ms,
    utc_offset_seconds,
    timezone,
    timezone_abbreviation,
    elevation,
    current_units,
    current,
    hourly_units,
    hourly,
    daily_units,
    daily,
  ])

  if (!weatherData) {
    return <div>Loading...</div>
  }

  return (
    <div className="weather-container">
      <h2>Weather Information</h2>
      <div>Latitude: {weatherData.latitude}</div>
      <div>Longitude: {weatherData.longitude}</div>
      <div>Timezone: {weatherData.timezone}</div>
      <div>
        Current Temperature: {weatherData.current.temperature_2m}{' '}
        {weatherData.current_units.temperature_2m}
      </div>
      {/* Render other weather data as needed */}
    </div>
  )
}
