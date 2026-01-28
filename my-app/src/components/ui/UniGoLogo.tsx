
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const UniGoLogo: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative cursor-pointer select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={false}
    >
      <svg
        width="280"
        height="400"
        viewBox="0 0 280 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="purple-glow overflow-visible"
      >
        {/* The Handle - Draws out of the suitcase */}
        <motion.path
          d="M100 60 V40 C100 30, 180 30, 180 40 V60"
          stroke="#A855F7"
          strokeWidth="12"
          strokeLinecap="round"
          initial={{ y: 20, opacity: 0 }}
          animate={{ 
            y: isHovered ? 0 : 20, 
            opacity: isHovered ? 1 : 0 
          }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        />

        {/* Suitcase Body */}
        <rect
          x="40"
          y="60"
          width="200"
          height="300"
          rx="24"
          fill="#111111"
          stroke="#A855F7"
          strokeWidth="4"
        />

        {/* Suitcase Straps / Details (Static Graffiti Vibe) */}
        <rect x="70" y="60" width="10" height="300" fill="#1a1a1a" />
        <rect x="200" y="60" width="10" height="300" fill="#1a1a1a" />

        {/* Eyes - Pop up with a wink */}
        <AnimatePresence>
          {isHovered && (
            <g>
              {/* Left Eye */}
              <motion.circle
                cx="100"
                cy="180"
                r="10"
                fill="#ffffff"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ delay: 0.1 }}
              />
              
              {/* Right Eye - Winking */}
              <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.ellipse
                  cx="180"
                  cy="180"
                  rx="10"
                  ry={isHovered ? 2 : 10} // Will simulate a wink in a loop if desired, here static wink
                  fill="#ffffff"
                  animate={{ 
                    ry: [10, 2, 10],
                    scaleY: [1, 0.2, 1]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2, 
                    times: [0, 0.1, 0.2],
                    repeatDelay: 3
                  }}
                />
              </motion.g>
            </g>
          )}
        </AnimatePresence>

        {/* The 'U' transforming into a 'Smile' */}
        <motion.path
          d={isHovered 
            ? "M90 240 Q140 300 190 240" // Smile Curve
            : "M90 220 V250 C90 280, 190 280, 190 250 V220" // 'U' Shape
          }
          stroke="#ffffff"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
          animate={{ d: isHovered 
            ? "M90 240 Q140 300 190 240" 
            : "M90 220 V250 C90 280, 190 280, 190 250 V220" 
          }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
        />

        {/* Brand Name Text (Graffiti Style below) */}
        <text
          x="140"
          y="420"
          textAnchor="middle"
          className="graffiti-text fill-purple-500 text-4xl"
          style={{ fontSize: '48px' }}
        >
          UniGo
        </text>
      </svg>

      {/* Graffiti Splatter Overlay (Animated Glow) */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        animate={{
          boxShadow: isHovered 
            ? "0 0 60px 10px rgba(168, 85, 247, 0.4)" 
            : "0 0 20px 0px rgba(168, 85, 247, 0.1)"
        }}
      />
    </motion.div>
  );
};
