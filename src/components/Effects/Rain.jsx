import React from "react";
import "../../index.css";

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

export default Rain;
