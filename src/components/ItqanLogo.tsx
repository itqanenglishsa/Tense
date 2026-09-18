import React from 'react';

interface ItqanLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'white' | 'dark' | 'color';
  showSubtitle?: boolean;
  className?: string;
  src?: string;
}

export const ItqanLogo: React.FC<ItqanLogoProps> = ({
  size = 'md',
  variant = 'color',
  showSubtitle = true,
  className = '',
  src = '/logo.png',
}) => {
  const sizeMap = {
    sm: { height: '28px', imgSize: 'h-7' },
    md: { height: '36px', imgSize: 'h-9' },
    lg: { height: '48px', imgSize: 'h-12' },
    xl: { height: '64px', imgSize: 'h-16' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center select-none ${className}`} dir="rtl">
      <img
        src={src}
        alt="إتقان Logo"
        className={`${currentSize.imgSize} w-auto object-contain transition-transform duration-300 hover:scale-105`}
      />
    </div>
  );
};