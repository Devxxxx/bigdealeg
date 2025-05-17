import React from 'react';

type LoadingSpinnerProps = {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
};

export default function LoadingSpinner({ 
  size = 'medium', 
  color = 'primary',
  className = ''
}: LoadingSpinnerProps) {
  // Determine size classes
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-2',
    large: 'h-12 w-12 border-3',
  };
  
  // Determine color classes
  const colorClasses = {
    primary: 'border-primary-300 border-t-primary',
    white: 'border-gray-200 border-t-white',
    gray: 'border-gray-200 border-t-gray-600',
  };
  
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`
          rounded-full
          animate-spin
          ${sizeClasses[size]}
          ${colorClasses[color]}
        `}
      ></div>
    </div>
  );
}