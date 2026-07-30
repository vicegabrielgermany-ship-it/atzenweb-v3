import React from 'react';

interface CloverMarkProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CloverMark({ className = '', size = 'md' }: CloverMarkProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-8 h-8'
  };

  return (
    <svg
      viewBox="0 0 24 24"
      className={`fill-current text-primary ${sizeClasses[size]} ${className}`}
      aria-hidden="true"
    >
      <path d="M11,11 C11,6 14,3 18,3 C20,3 21,5 21,8 C21,11 16,11 13,11 C13,11 12,11 11,11 Z" />
      <path d="M13,13 C18,13 21,16 21,18 C21,20 20,21 18,21 C14,21 11,16 11,13 C11,13 11,12 13,13 Z" />
      <path d="M11,13 C6,13 3,16 3,18 C3,20 5,21 8,21 C11,21 16,18 16,15 C16,15 15,14 11,13 Z" />
      <path d="M13,11 C8,11 5,8 5,6 C5,4 6,3 8,3 C11,3 16,6 16,9 C16,9 15,10 13,11 Z" />
      <circle cx="12" cy="12" r="1.5" className="fill-canvas" />
    </svg>
  );
}
