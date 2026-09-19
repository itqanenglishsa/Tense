import React from 'react';

interface ItqanLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'white' | 'dark' | 'color';
  showSubtitle?: boolean;
  className?: string;
}

// Resolve the logo through Vite so it is included correctly
// when the project is built and deployed.
const logoUrl = new URL('../../logo.png', import.meta.url).href;

export const ItqanLogo: React.FC<ItqanLogoProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-12',
    xl: 'h-16',
  };

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src={logoUrl}
        alt="Itqan English"
        className={`${sizeMap[size]} w-auto object-contain`}
      />
    </div>
  );
};