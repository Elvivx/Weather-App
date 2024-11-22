import "./assets/App.scss"
import Weather from "./weather"
import Load from "./load"
import Forecast from "./forecasts"
import { useEffect, useState } from "react"
function App() {
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState(null)
  const [weather, setWeather] = useState(null)
  const [theme, setTheme] = useState(() => {
    // Load theme from localStorage, default to light mode
    return localStorage.getItem("theme") === "dark" ? false : true
  })

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = !prevTheme
      localStorage.setItem("theme", newTheme ? "light" : "dark") // Save to localStorage
      return newTheme
    })
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { longitude } = position.coords
      const { latitude } = position.coords
      setLocation(`${latitude}+,+${longitude}`)
    })
    if (location) {
      apiCall(location)
    }
  }, [location])

  const apiCall = async (locate) => {
    try {
      const api = `https://api.weatherapi.com/v1/forecast.json?key=0aee6c0beaa8407ab78132801242609&q=${locate}&days=1&aqi=no&alerts=no`

      let data = await fetch(api).then((response) => response)
      console.log(data.status)
      if (data.status !== 200) throw new Error()
      data = await data.json()
      setWeather([data])
      setLoading(false)
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <main className={theme ? "light" : "dark"}>
      <section className='main' style={loading ? { height: "500px" } : { display: "grid" }}>
        {!loading ? (
          <>
            <Weather weatherData={weather} theme={theme} setTheme={toggleTheme} setLocation={setLocation} loading={setLoading} />
            <Forecast weatherData={weather} />
          </>
        ) : (
          <Load />
        )}
      </section>
    </main>
  )
}
export default App
