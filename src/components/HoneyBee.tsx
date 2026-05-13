import React from 'react';

interface HoneyBeeProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export default function HoneyBee({ size = 24, className, ...props }: HoneyBeeProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Body Shape */}
      <rect x="7" y="10" width="10" height="7" rx="3.5" />
      
      {/* Stripes */}
      <path d="M10 10v7" />
      <path d="M14 10v7" />
      
      {/* Wings - Top Side View */}
      <path 
        d="M9 10c-1-4 2-6 5-6s5 2 2 6" 
        className="fill-current opacity-20"
      />
      <path 
        d="M11 10c-1-3 1-5 3-5s3 1.5 1 5" 
        className="fill-current opacity-40"
      />
      
      {/* Head */}
      <circle cx="5" cy="13.5" r="2" />
      
      {/* Antenna */}
      <path d="M4 11.5c-0.5-1-1.5-1.5-2-1" />
      
      {/* Stinger */}
      <path d="M17 13.5h2.5" />
      
      {/* Legs (Simple sticks) */}
      <path d="M9 17v1.5" />
      <path d="M12 17v1.5" />
      <path d="M15 17v1.5" />
    </svg>
  );
}
