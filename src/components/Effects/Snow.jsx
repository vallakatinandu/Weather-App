import React from "react";
import "../../index.css";

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

export default Snow;
