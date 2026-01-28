import React, { useState } from 'react';
import './UniGoLogo.css';

const UniGoLogo = ({ size = 60, showText = true, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Scale factor based on size
  const scale = size / 60;

  return (
    <div
      className={`unigo-logo-container ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="unigo-suitcase-wrapper" style={{ width: size * 1.2, height: size * 1.5 }}>
        {/* Purple Glow Effect */}
        <div className="unigo-glow"></div>

        {/* SVG Suitcase */}
        <svg
          viewBox="0 0 80 100"
          className="unigo-suitcase-svg"
          style={{ width: '100%', height: '100%' }}
        >
          {/* Handle - animates up on hover */}
          <g className="unigo-handle">
            <rect
              x="30"
              y={isHovered ? "-5" : "5"}
              width="20"
              height="12"
              rx="3"
              fill="transparent"
              stroke="url(#handleGradient)"
              strokeWidth="3"
              className="handle-rect"
            />
          </g>

          {/* Main Suitcase Body */}
          <rect
            x="8"
            y="18"
            width="64"
            height="78"
            rx="8"
            fill="rgba(10, 10, 20, 0.9)"
            stroke="url(#suitcaseGradient)"
            strokeWidth="3"
            className="suitcase-body"
          />

          {/* Decorative Lines (zipper effect) */}
          <line
            x1="15" y1="50" x2="65" y2="50"
            stroke="rgba(100, 140, 220, 0.3)"
            strokeWidth="1.5"
            strokeDasharray="4,3"
          />
          <line
            x1="15" y1="72" x2="65" y2="72"
            stroke="rgba(100, 140, 220, 0.3)"
            strokeWidth="1.5"
            strokeDasharray="4,3"
          />

          {/* Eyes */}
          <g className="unigo-eyes">
            {/* Left Eye - winks on hover */}
            {isHovered ? (
              // Winking eye (line)
              <line
                x1="25" y1="36" x2="33" y2="36"
                stroke="rgba(120, 160, 255, 0.9)"
                strokeWidth="3"
                strokeLinecap="round"
                className="eye-wink"
              />
            ) : (
              // Open eye (rectangle)
              <rect
                x="26" y="32" width="6" height="8"
                fill="rgba(120, 160, 255, 0.9)"
                rx="1"
                className="eye-left"
              />
            )}

            {/* Right Eye - always open */}
            <rect
              x="48" y="32" width="6" height="8"
              fill="rgba(120, 160, 255, 0.9)"
              rx="1"
              className="eye-right"
            />
          </g>

          {/* U Smile - transforms to wider smile on hover */}
          <path
            d={isHovered
              ? "M 28 58 Q 40 75 52 58" // Wider smile on hover
              : "M 30 55 Q 40 70 50 55"  // Normal U shape
            }
            fill="transparent"
            stroke="rgba(120, 160, 255, 0.9)"
            strokeWidth="4"
            strokeLinecap="round"
            className="unigo-smile"
          />

          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="suitcaseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4a7dff" />
              <stop offset="50%" stopColor="#7b5cff" />
              <stop offset="100%" stopColor="#4a7dff" />
            </linearGradient>
            <linearGradient id="handleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4a7dff" />
              <stop offset="100%" stopColor="#7b5cff" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* UniGo Text */}
      {showText && (
        <div className="unigo-text-container">
          <span className="unigo-brand-text">UniGo</span>
        </div>
      )}
    </div>
  );
};

export default UniGoLogo;
