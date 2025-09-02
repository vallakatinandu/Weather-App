import React, { useState, useEffect, useRef } from "react";
import "./index.css";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import ForecastGrid from "./components/ForecastGrid";

export default function App() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  
  const weatherCodeToEmoji = (code) => {
    if ([0].includes(code)) return { emoji: "☀️", anim: "sunny" };
    if ([1, 2, 3].includes(code)) return { emoji: "⛅", anim: "partly-cloudy" };
    if ([45, 48].includes(code)) return { emoji: "🌫", anim: "fog" };
    if ([51, 53, 55, 56, 57].includes(code)) return { emoji: "🌦", anim: "rain" };
    if ([61, 63, 65, 66, 67].includes(code)) return { emoji: "🌧", anim: "rain" };
    if ([71, 73, 75, 77].includes(code)) return { emoji: "❄️", anim: "snow" };
    if ([80, 81, 82].includes(code)) return { emoji: "🌧", anim: "rain" };
    if ([85, 86].includes(code)) return { emoji: "🌨", anim: "snow" };
    if ([95, 96, 99].includes(code)) return { emoji: "⛈", anim: "storm" };
    return { emoji: "🌈", anim: "" };
  };

  const fetchWeather = async (lat, lon) => {
    if (controllerRef.current) controllerRef.current.abort();
    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;

    try {
      setLoading(true);
      setError(null);
      setData(null);
      setForecast(null);

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
      const res = await fetch(url, { signal });
      if (!res.ok) throw new Error("Weather data not available");

      const json = await res.json();
      setData(json.current_weather);
      setForecast(json.daily);
    } catch (err) {
      if (err.name !== "AbortError") setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoordinates = async (cityName) => {
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        cityName
      )}&count=1`;
      const res = await fetch(url);
      const json = await res.json();
      if (!json.results || json.results.length === 0)
        throw new Error("City not found");

      const { latitude, longitude, name, country } = json.results[0];
      fetchWeather(latitude, longitude);
      setCity(`${name}, ${country}`);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const id = setTimeout(() => {
      if (query.trim()) fetchCoordinates(query.trim());
    }, 500);
    return () => clearTimeout(id);
  }, [query]);

  return (
    <div className="app-container">
      <div className="weather-card">
        <h1 className="app-title">🌤 Animated Weather</h1>
        <SearchBar query={query} setQuery={setQuery} onSearch={() => fetchCoordinates(query.trim())} />

        <main className="weather-content">
          {loading ? (
            <div className="loader">Loading...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : data ? (
            <>
              <CurrentWeather data={data} city={city} weatherCodeToEmoji={weatherCodeToEmoji} />
              {forecast && <ForecastGrid forecast={forecast} weatherCodeToEmoji={weatherCodeToEmoji} />}
            </>
          ) : (
            <div className="placeholder">🔎 Search for a city to see the weather</div>
          )}
        </main>
      </div>
    </div>
  );
}
