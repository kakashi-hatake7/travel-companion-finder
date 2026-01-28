
import React, { useState } from 'react';

export const UniGoLogo: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  // Path for the "U" that transitions to a "Smile"
  const mouthPath = isHovered 
    ? "M50 140 Q80 170 110 140" // Smile
    : "M60 115 V130 Q60 145 80 145 Q100 145 100 130 V115"; // U-shape

  return (
    <div 
      className="relative flex flex-col items-center justify-center p-12 transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative group">
        {/* SVG Container */}
        <svg 
          width="160" 
          height="240" 
          viewBox="0 0 160 240" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="neon-glow transform transition-transform duration-500 group-hover:scale-105"
        >
          {/* Graffiti Glow Filter */}
          <defs>
            <filter id="purpleGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            {/* Texture/Noise for Graffiti look */}
            <filter id="noise">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
                <feColorMatrix type="matrix" values="0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 -1 1" />
            </filter>
          </defs>

          {/* Suitcase Handle - Animated */}
          <path
            d="M50 40 L50 15 Q50 5 60 5 L100 5 Q110 5 110 15 L110 40"
            stroke="#A855F7"
            strokeWidth="8"
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
            style={{
              transform: isHovered ? 'translateY(0)' : 'translateY(35px)',
              opacity: isHovered ? 1 : 0,
            }}
          />

          {/* Suitcase Body */}
          <rect
            x="20"
            y="40"
            width="120"
            height="180"
            rx="12"
            fill="#111"
            stroke="#A855F7"
            strokeWidth="3"
            filter="url(#purpleGlow)"
          />
          
          {/* Eyes */}
          {/* Left Eye */}
          <circle 
            cx="55" 
            cy="90" 
            r="6" 
            fill="#A855F7" 
            className="transition-all duration-300"
            style={{ opacity: isHovered ? 1 : 0.4 }}
          />
          
          {/* Right Eye (Blinking) */}
          <ellipse 
            cx="105" 
            cy="90" 
            rx="6" 
            ry={isHovered ? 0.5 : 6} 
            fill="#A855F7" 
            className="transition-all duration-150 ease-in-out"
            style={{ 
              opacity: isHovered ? 1 : 0.4,
              transformOrigin: '105px 90px'
            }}
          />
          
          {/* Suitcase Details (Latches/Lines) for character */}
          <rect x="35" y="55" width="15" height="6" rx="1" fill="#333" />
          <rect x="110" y="55" width="15" height="6" rx="1" fill="#333" />
          
          {/* Graffiti Stencil Lines */}
          <path d="M20 110 H140" stroke="#A855F7" strokeWidth="0.5" strokeDasharray="4 2" opacity="0.3" />
          <path d="M20 170 H140" stroke="#A855F7" strokeWidth="0.5" strokeDasharray="4 2" opacity="0.3" />

          {/* Mouth / Center Logo Icon (Transitions from 'U' to 'Smile') */}
          <path
            d={mouthPath}
            stroke="#A855F7"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-500 ease-in-out"
          />
        </svg>

        {/* Ambient Splatter Effect */}
        <div className={`absolute -inset-4 transition-opacity duration-700 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute top-0 left-1/4 w-2 h-2 bg-purple-500 rounded-full blur-[1px]"></div>
            <div className="absolute bottom-1/4 right-0 w-3 h-3 bg-purple-600 rounded-full blur-[2px]"></div>
            <div className="absolute top-1/2 -left-2 w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <h1 className={`text-6xl font-graffiti tracking-tighter transition-all duration-500 ${isHovered ? 'text-purple-500 scale-110 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]' : 'text-white'}`}>
          UniGo
        </h1>
        <p className="text-gray-500 mt-2 font-light tracking-widest uppercase text-xs">Premium Motion Travel</p>
      </div>
    </div>
  );
};
