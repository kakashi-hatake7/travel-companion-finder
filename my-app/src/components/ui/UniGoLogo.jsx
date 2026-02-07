import React, { useState, useEffect } from 'react';
import './UniGoLogo.css';

const UniGoLogo = ({ size = 48, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  // Auto-blink animation every 3 seconds
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 3000);

    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <div
      className={`unigo-logo-container ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Icon - Larger suitcase with taller body (rectangle) */}
      <div className="unigo-icon-wrapper" style={{ width: size, height: size * 1.4 }}>
        <svg
          viewBox="0 0 100 140"
          className="unigo-logo-svg"
          style={{ width: '100%', height: '100%' }}
        >
          {/* Main Suitcase Icon - Taller rectangular body */}
          <g className="unigo-main-icon">
            {/* Suitcase Body - Much taller rectangle */}
            <rect
              x="15"
              y="35"
              width="70"
              height="95"
              rx="12"
              fill="none"
              stroke="url(#primaryGradient)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon-body"
            />

            {/* Handle - clean curved line */}
            <path
              d="M 35 35 L 35 22 Q 35 15 42 15 L 58 15 Q 65 15 65 22 L 65 35"
              fill="none"
              stroke="url(#primaryGradient)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon-handle"
            />

            {/* Eyes - with blink animation - positioned lower */}
            <g className="icon-eyes">
              {/* Left Eye */}
              {isBlinking || isHovered ? (
                <line
                  x1="35" y1="85" x2="42" y2="85"
                  stroke="url(#primaryGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="eye-blink"
                />
              ) : (
                <circle
                  cx="38.5" cy="85" r="4"
                  fill="url(#primaryGradient)"
                  className="eye-open"
                />
              )}

              {/* Right Eye */}
              <circle
                cx="61.5" cy="85" r="4"
                fill="url(#primaryGradient)"
                className="eye-open"
              />
            </g>

            {/* Smile - positioned quite low for cute effect */}
            <path
              d={isHovered
                ? "M 35 105 Q 50 117 65 105"
                : "M 37 105 Q 50 115 63 105"
              }
              fill="none"
              stroke="url(#primaryGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              className="icon-smile"
            />
          </g>

          {/* Gradient Definition */}
          <defs>
            <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF385C" />
              <stop offset="50%" stopColor="#E31C5F" />
              <stop offset="100%" stopColor="#D70466" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* UniGo Text - Airbnb style (lowercase, next to icon) */}
      <span className="unigo-brand-text">unigo</span>
    </div>
  );
};

export default UniGoLogo;
