import React from 'react';

interface SunburstBgProps {
  className?: string;
  animated?: boolean;
}

export function SunburstBg({ className = 'left-1/2 top-1/2', animated = false }: SunburstBgProps) {
  const bgClass = animated ? 'bg-sunburst-animated' : 'bg-sunburst';

  return (
    <div className={`absolute w-[300vmax] h-[300vmax] min-w-[300vmax] min-h-[300vmax] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0 ${className}`} aria-hidden="true">
      <div className={`w-full h-full rounded-full ${bgClass}`} />
    </div>
  );
}
