import React from "react";
import Rain from "./Effects/Rain";
import Snow from "./Effects/Snow";
import Lightning from "./Effects/Lightning";

const CurrentWeather = ({ data, city, weatherCodeToEmoji }) => {
  const { emoji, anim } = weatherCodeToEmoji(data.weathercode);
  const isRainy = ["rain", "storm"].includes(anim);
  const isSnowy = anim === "snow";
  const isStormy = anim === "storm";

  return (
    <div className="current-weather">
      <div className={`animated-icon ${anim}`}>{emoji}</div>

      {/* Effects */}
      {isRainy && <Rain />}
      {isSnowy && <Snow />}
      {isStormy && <Lightning />}

      <div className="temperature">{Math.round(data.temperature)}°C</div>
      <div className="condition">Wind {data.windspeed} km/h</div>
      <div className="details">
        {city} • {new Date(data.time).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default CurrentWeather;
