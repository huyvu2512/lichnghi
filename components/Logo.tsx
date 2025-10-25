import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-6 h-6" }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V7z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 11h16" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 5V3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 5V3" />
    </svg>
  );
};

export default Logo;