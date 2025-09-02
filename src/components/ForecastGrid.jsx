import React from "react";

const ForecastGrid = ({ forecast, weatherCodeToEmoji }) => (
  <div className="forecast-grid">
    {forecast.time.slice(0, 4).map((day, i) => {
      const { emoji, anim } = weatherCodeToEmoji(forecast.weathercode[i]);
      return (
        <div className="forecast-card" key={day}>
          <div className="forecast-date">
            {new Date(day).toLocaleDateString("en-US", { weekday: "short" })}
          </div>
          <div className={`forecast-icon ${anim}`}>{emoji}</div>
          <div className="forecast-temp">
            {forecast.temperature_2m_max[i]}° / {forecast.temperature_2m_min[i]}°
          </div>
        </div>
      );
    })}
  </div>
);

export default ForecastGrid;
