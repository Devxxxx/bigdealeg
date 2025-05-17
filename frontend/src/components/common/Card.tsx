import React, { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'xs' | 'small' | 'medium' | 'large';
  shadow?: 'none' | 'small' | 'medium' | 'large';
  rounded?: 'none' | 'small' | 'medium' | 'large';
  border?: boolean;
  hover?: boolean;
  clickable?: boolean;
};

export default function Card({ 
  children, 
  className = '',
  padding = 'small',
  shadow = 'small',
  rounded = 'medium',
  border = false,
  hover = false,
  clickable = false
}: CardProps) {
  // Padding classes
  const paddingClasses = {
    none: 'p-0',
    xs: 'p-2',
    small: 'p-3',
    medium: 'p-4',
    large: 'p-5',
  };
  
  // Shadow classes
  const shadowClasses = {
    none: '',
    small: 'shadow-sm',
    medium: 'shadow',
    large: 'shadow-lg',
  };
  
  // Rounded corner classes
  const roundedClasses = {
    none: 'rounded-none',
    small: 'rounded-md',
    medium: 'rounded-lg',
    large: 'rounded-xl',
  };
  
  // Border class
  const borderClass = border ? 'border border-gray-100' : '';
  
  // Hover effect
  const hoverClass = hover ? 'transition-all duration-200 hover:shadow-md hover:translate-y-[-1px]' : '';
  
  // Clickable effect
  const clickableClass = clickable ? 'cursor-pointer active:scale-[0.99] active:shadow-inner transition-transform' : '';
  
  return (
    <div 
      className={`
        bg-white
        ${paddingClasses[padding]}
        ${shadowClasses[shadow]}
        ${roundedClasses[rounded]}
        ${borderClass}
        ${hoverClass}
        ${clickableClass}
        ${className}
      `}
    >
      {children}
    </div>
  );
}