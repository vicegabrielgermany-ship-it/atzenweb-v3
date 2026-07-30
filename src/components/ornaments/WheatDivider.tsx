import React from 'react';

interface WheatDividerProps {
  className?: string;
  flip?: boolean;
}

export function WheatDivider({ className = '', flip = false }: WheatDividerProps) {
  return (
    <div className={`w-full flex items-center justify-center opacity-80 ${className}`}>
      {/* A stylized screen-print wheat stalk svg */}
      <svg
        viewBox="0 0 100 20"
        className={`w-full max-w-sm h-4 text-accent fill-current ${flip ? 'scale-x-[-1]' : ''}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <path d="M0,10 L45,10 C46,8 48,5 50,5 C52,5 54,8 55,10 L100,10" stroke="currentColor" strokeWidth="1" fill="none" />
        {/* Left grains */}
        <path d="M40,10 C42,7 45,8 45,10 C45,12 42,13 40,10 Z" />
        <path d="M35,10 C37,7 40,8 40,10 C40,12 37,13 35,10 Z" />
        <path d="M30,10 C32,7 35,8 35,10 C35,12 32,13 30,10 Z" />
        {/* Right grains */}
        <path d="M60,10 C58,7 55,8 55,10 C55,12 58,13 60,10 Z" />
        <path d="M65,10 C63,7 60,8 60,10 C60,12 63,13 65,10 Z" />
        <path d="M70,10 C68,7 65,8 65,10 C65,12 68,13 70,10 Z" />
        {/* Center */}
        <circle cx="50" cy="10" r="1.5" />
      </svg>
    </div>
  );
}
