import React, { useEffect, useState } from 'react'
import GetUserLocation from './Location'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { BsSearch } from 'react-icons/bs'
import './Weather.css'
import Bulk from '../db.json'
import SunsetSunriseChart from './SunsetSunriseChart'
import Chart from './Chart'
let weatherAPI = {
  key: '0f95bf2cdc2b5c87c680a1e9231923e8',
  baseUrl: 'https://api.openweathermap.org/data/2.5/weather?'
}

const Weather = () => {
  const [data, setData] = useState([])
  const [cordData, setCordData] = useState([])
  const [query, setQuery] = useState('Aurangabad')
  const [active, setActive] = useState(0)
  const [inputStyle, setInputStyle] = useState(false)
  const [display, setDisplay] = useState([])
  const [displayMode, setDisplayMode] = useState(true)
  const local = GetUserLocation()

  //daf81f9bedba9c24a0f37473fadff8aa

  // Getting Onecall Data
  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord?.lat}&lon=${data.coord?.lon}&units=metric&exclude=minutely&appid=${weatherAPI.key}`
    )
      .then(res => res.json())
      .then(res => {
        setCordData(res)
      })
      .catch(error => {
        console.log(error)
      })
  }, [data.coord?.lat, data.coord?.lon])

  //  For getting One CallData;
  useEffect(() => {
    fetch(
      `${weatherAPI.baseUrl}q=${query}&units=metric&exclude=hourly,minutely&appid=${weatherAPI.key}`
    )
      .then(res => res.json())
      .then(res => {
        setData(res)
      })
      .catch(err => {
        console.log(err)
      })
  }, [query])

  //For  displaying Day
  const displayDate = d => {
    let day = new Date(d * 1000).getDay()

    switch (day) {
      case 0:
        return 'Sun'
      case 1:
        return 'Mon'
      case 2:
        return 'Tue'
      case 3:
        return 'Wed'
      case 4:
        return 'Thu'
      case 5:
        return 'Fri'
      case 6:
        return 'Sat'
    }
    return day
  }

  // Convert String to Hour
  const convertString = d => {
    return new Date(d * 1000).getHours()
  }

  // Daily forcast box style handeling onClick
  const dailyCardClick = index => {
    setActive(index)
  }

  // Input box style handeling onClick
  const inPutBox = () => {
    setInputStyle(current => !current)
    {
      !query ? filterBulkData('') : filterBulkData(query)
    }
    setDisplayMode(true)
  }

  // Autosuggetion data handeling onChange
  const filterBulkData = text => {
    let matches = Bulk.filter(x => {
      const regex = new RegExp(`${text}`, 'gi')
      return x.city.match(regex) || x.state.match(regex)
    })
    setDisplay(matches)
  }

  // Input box handeling onChange
  const handleChange = e => {
    filterBulkData(e.target.value)
    setQuery(e.target.value)
    setDisplayMode(true)
  }

  // Autosuggetion handeling onClick
  const setSearch = city => {
    const edit = Bulk.filter(item => {
      return item.city === city
    })
    setQuery(edit[0].city)
    setDisplayMode(current => !current)
  }

  const sunData = [
    {
      sun: `${convertString(data.sys?.sunrise)}:${new Date(
        data.sys?.sunrise
      ).getMinutes()} am`,
      value: 0
    },
    { sun: '', value: 10 },
    {
      sun: `${convertString(data.sys?.sunset) - 12}:${new Date(
        data.sys?.sunset
      ).getMinutes()} pm`,
      value: 0
    }
  ]

  return (
    <main>
      {/* Top input-box form */}
      <form onSubmit={e => e.preventDefault()}>
        <div
          className='input-box'
          style={{
            border: inputStyle ? '2px solid #131313' : 'none'
          }}
        >
          <FaMapMarkerAlt className='map-icon' />
          <input
            onClick={inPutBox}
            type='text'
            placeholder='...Search'
            onChange={handleChange}
            value={query}
          />
          <BsSearch
            className='search-icon'
            onClick={() => setDisplayMode(current => !current)}
          />
        </div>
      </form>

      {/* For auto suggestions */}
      <div className='bulk-data-container'>
        {displayMode &&
          display.map((e, i) => (
            <div
              key={i}
              className='bulk-data'
              onClick={() => setSearch(e.city)}
            >
              <div className='bulk-data-info'>
                <strong>{e.city},</strong>
                <p>{e.state}</p>
              </div>
              <div className='bulk-data-icon'>
                <FaMapMarkerAlt />
              </div>
            </div>
          ))}
      </div>

      {local.loaded && data.sys?.country === 'IN' && cordData.daily && (
        <>
          {/* Daily Forcast Box*/}
          <section className='top'>
            {cordData.daily.map((e, i) => (
              <div
                key={e.dt}
                className={
                  active === i
                    ? 'clicked-single-daily-card'
                    : 'single-daily-card'
                }
                onClick={() => dailyCardClick(i)}
              >
                <p>{displayDate(e.dt)}</p>
                <div className='daily-temp'>
                  <p>{Math.round(e.temp.max)}°</p>
                  <p>{Math.round(e.temp.min)}°</p>
                </div>
                <div className='daily-img'>
                  <img
                    src={`https://openweathermap.org/img/wn/${e?.weather[0]?.icon}@2x.png`}
                    alt=''
                  />
                </div>
                <p>{e.weather[0]?.main}</p>
              </div>
            ))}
          </section>

          {/* Mid-n-Bottom Box */}
          <section className='bottom'>
            <div className='current-temp-img'>
              <strong>{Math.round(data.main?.temp)}°C</strong>
              <div className='current-img'>
                <img
                  src={`https://openweathermap.org/img/wn/${cordData.current?.weather[0]?.icon}@2x.png`}
                  alt=''
                />
              </div>
            </div>

            {/* Chart */}

            <Chart cordData={cordData} />
            {/* Humidity and Pressure */}
            <div className='hum-Pre'>
              <div className='pressure'>
                <strong>Pressure</strong>
                <p>{cordData.current.pressure} hPa</p>
              </div>
              <div className='humidity'>
                <strong>Humidity</strong>
                <p>{cordData.current.humidity} %</p>
              </div>
            </div>

            {/* Sunset and Sunrise */}

            <div className='sun-SetRise'>
              <div className='sunrise'>
                <strong>Sunrise</strong>
                <p>
                  {`${convertString(data.sys?.sunrise)}:${new Date(
                    data.sys?.sunrise
                  ).getMinutes()} am`}
                </p>
              </div>
              <div className='sunset'>
                <strong>Sunset</strong>
                <p>
                  {`${convertString(data.sys?.sunset) - 12}:${new Date(
                    data.sys?.sunrise
                  ).getMinutes()} pm`}
                </p>
              </div>
            </div>

            {/* Sunset-Sunrise Chart */}
            <SunsetSunriseChart sunData={sunData} />
          </section>
        </>
      )}
    </main>
  )
}

export default Weather
