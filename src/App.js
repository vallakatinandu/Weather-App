import React, { useState, useEffect, useRef } from "react";
import "./index.css";

// Rain component
const Rain = () => {
  const drops = Array.from({ length: 30 });
  return (
    <div className="rain-container">
      {drops.map((_, i) => (
        <div
          className="raindrop"
          key={i}
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random()}s`,
          }}
        ></div>
      ))}
    </div>
  );
};

// Snow component
const Snow = () => {
  const flakes = Array.from({ length: 30 });
  return (
    <div className="snow-container">
      {flakes.map((_, i) => (
        <div
          className="snowflake"
          key={i}
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            fontSize: `${Math.random() * 16 + 10}px`,
          }}
        >
          ❄️
        </div>
      ))}
    </div>
  );
};

// Lightning component
const Lightning = () => (
  <div className="lightning"></div>
);

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
      if (!json.results || json.results.length === 0) throw new Error("City not found");
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

  const isRainy = data && ["rain", "storm"].includes(weatherCodeToEmoji(data.weathercode).anim);
  const isSnowy = data && ["snow"].includes(weatherCodeToEmoji(data.weathercode).anim);
  const isStormy = data && weatherCodeToEmoji(data.weathercode).anim === "storm";

  return (
    <div className="app-container">
      <div className="weather-card">
        <h1 className="app-title">🌤 Animated Weather</h1>

        <div className="search-bar">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter city (e.g., Mumbai)"
          />
          <button onClick={() => fetchCoordinates(query.trim())}>Search</button>
        </div>

        <main className="weather-content">
          {loading ? (
            <div className="loader">Loading...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : data ? (
            <>
              <div className="current-weather">
                <div className={`animated-icon ${weatherCodeToEmoji(data.weathercode).anim}`}>
                  {weatherCodeToEmoji(data.weathercode).emoji}
                </div>

                {/* Add rain, snow, lightning effects */}
                {isRainy && <Rain />}
                {isSnowy && <Snow />}
                {isStormy && <Lightning />}

                <div className="temperature">{Math.round(data.temperature)}°C</div>
                <div className="condition">Wind {data.windspeed} km/h</div>
                <div className="details">
                  {city} • {new Date(data.time).toLocaleTimeString()}
                </div>
              </div>

              {forecast && (
                <div className="forecast-grid">
                  {forecast.time.slice(0, 4).map((day, i) => {
                    const { emoji, anim } = weatherCodeToEmoji(forecast.weathercode[i]);
                    return (
                      <div className="forecast-card" key={day}>
                        <div className="forecast-date">{new Date(day).toLocaleDateString("en-US", { weekday: "short" })}</div>
                        <div className={`forecast-icon ${anim}`}>{emoji}</div>
                        <div className="forecast-temp">{forecast.temperature_2m_max[i]}° / {forecast.temperature_2m_min[i]}°</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="placeholder">🔎 Search for a city to see the weather</div>
          )}
        </main>
      </div>
    </div>
  );
}
