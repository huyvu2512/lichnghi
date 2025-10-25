import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-6 h-6" }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-3.49 1.4-6 4.9-6 9s2.51 7.6 6 9c3.49-1.4 6-4.9 6-9s-2.51-7.6-6-9Z" />
    </svg>
  );
};

export default Logo;