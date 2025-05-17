import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import Link from 'next/link';
import LoadingSpinner from './LoadingSpinner';

// Type for variant (color)
type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'outline' | 'gradient';

// Type for size
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Props interface for Button component
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  href?: string;
  loading?: boolean;
  outline?: boolean;
  rounded?: boolean;
  glass?: boolean;
  animation?: 'none' | 'pulse' | 'bounce';
  className?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  href,
  loading = false,
  outline = false,
  rounded = true,
  glass = false,
  animation = 'none',
  className = '',
  leftIcon,
  rightIcon,
  ...props
}: ButtonProps) {
  // Variant (color) classes
  const variantClasses = {
    primary: outline 
      ? 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 active:bg-primary-100' 
      : 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm',
    secondary: outline 
      ? 'border-2 border-gray-400 text-gray-700 hover:bg-gray-50 active:bg-gray-100' 
      : 'bg-gray-600 hover:bg-gray-700 text-white shadow-sm',
    success: outline 
      ? 'border-2 border-green-500 text-green-600 hover:bg-green-50 active:bg-green-100' 
      : 'bg-green-600 hover:bg-green-700 text-white shadow-sm',
    danger: outline 
      ? 'border-2 border-red-500 text-red-600 hover:bg-red-50 active:bg-red-100' 
      : 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
    warning: outline 
      ? 'border-2 border-amber-500 text-amber-600 hover:bg-amber-50 active:bg-amber-100' 
      : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm',
    info: outline 
      ? 'border-2 border-blue-400 text-blue-500 hover:bg-blue-50 active:bg-blue-100' 
      : 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm',
    light: outline 
      ? 'border-2 border-gray-200 text-gray-600 hover:bg-gray-50 active:bg-gray-100' 
      : 'bg-gray-100 hover:bg-gray-200 text-gray-800',
    dark: outline 
      ? 'border-2 border-gray-700 text-gray-800 hover:bg-gray-800 hover:text-white' 
      : 'bg-gray-800 hover:bg-gray-900 text-white shadow-sm',
    outline: 'border-2 border-gray-300 text-gray-700 hover:border-primary-500 hover:text-primary-600 bg-white',
    gradient: 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-sm',
  };

  // Size classes
  const sizeClasses = {
    xs: 'text-xs px-2.5 py-1.5 gap-1',
    sm: 'text-sm px-3 py-2 gap-1.5',
    md: 'text-base px-4 py-2.5 gap-2',
    lg: 'text-lg px-5 py-3 gap-2',
    xl: 'text-xl px-6 py-3.5 gap-2.5',
  };

  // Width classes
  const widthClass = fullWidth ? 'w-full' : '';

  // Rounded classes
  const roundedClass = rounded ? 'rounded-full' : 'rounded-lg';

  // Glass effect
  const glassClass = glass ? 'backdrop-blur-sm bg-opacity-80 shadow-sm' : '';

  // Animation classes
  const animationClasses = {
    none: '',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
  };

  // Disabled classes
  const disabledClass = props.disabled ? 'opacity-60 cursor-not-allowed' : 'transform active:scale-[0.98] transition-transform';

  // Base button classes
  const buttonClasses = `
    inline-flex items-center justify-center
    font-medium
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${widthClass}
    ${roundedClass}
    ${glassClass}
    ${animationClasses[animation]}
    ${disabledClass}
    ${className}
  `;

  // If href is provided, render as Link
  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {leftIcon && <span className="flex items-center">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="flex items-center">{rightIcon}</span>}
      </Link>
    );
  }

  // Otherwise render as button
  return (
    <button 
      className={buttonClasses} 
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <LoadingSpinner 
          size="small" 
          color={outline ? "primary" : "white"} 
        />
      ) : leftIcon ? (
        <span className="flex items-center">{leftIcon}</span>
      ) : null}
      
      <span>{children}</span>
      
      {rightIcon && !loading && (
        <span className="flex items-center">{rightIcon}</span>
      )}
    </button>
  );
}