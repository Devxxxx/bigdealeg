'use client';

import React, { InputHTMLAttributes, ReactNode, forwardRef, useState } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  errorMessage?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  containerClassName?: string;
  clickableRightIcon?: boolean;
  onRightIconClick?: () => void;
  label?: string;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outline' | 'underlined' | 'glass';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isRequired?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  error = false,
  errorMessage,
  leftIcon,
  rightIcon,
  className = '',
  containerClassName = '',
  clickableRightIcon = false,
  onRightIconClick,
  label,
  helperText,
  variant = 'default',
  size = 'md',
  isRequired = false,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  
  // Handle variant styles
  const variantClasses = {
    default: `border-gray-300 ${isFocused ? 'border-primary-500 ring-2 ring-primary-50' : 'hover:border-gray-400'} bg-white shadow-sm`,
    filled: `bg-gray-50 border-transparent ${isFocused ? 'border-primary-500 ring-2 ring-primary-50' : 'hover:bg-gray-100'}`,
    outline: `bg-transparent border-gray-300 ${isFocused ? 'border-primary-500 ring-2 ring-primary-50' : 'hover:border-gray-400'}`,
    underlined: `border-t-0 border-l-0 border-r-0 border-b-2 rounded-none px-0 ${isFocused ? 'border-primary-500' : 'border-gray-300 hover:border-gray-400'}`,
    glass: `backdrop-blur-sm bg-white bg-opacity-70 border-white border-opacity-20 shadow-sm ${isFocused ? 'ring-2 ring-white ring-opacity-50' : 'hover:bg-opacity-80'}`
  };
  
  // Handle error state
  const errorClasses = error 
    ? 'border-danger-300 text-danger-900 placeholder-danger-300 focus:ring-danger-500 focus:border-danger-500' 
    : variantClasses[variant];
  
  // Size classes
  const sizeClasses = {
    xs: 'py-1 text-xs',
    sm: 'py-1.5 text-sm',
    md: 'py-2 text-sm',
    lg: 'py-3 text-base'
  };
  
  // Padding for icons
  const leftPaddingClass = leftIcon ? 'pl-10' : 'pl-4';
  const rightPaddingClass = rightIcon ? 'pr-10' : 'pr-4';
  
  // Remove left/right padding for underlined variant
  const paddingClasses = variant === 'underlined' 
    ? `py-2 ${rightIcon ? 'pr-6' : ''}` 
    : `${leftPaddingClass} ${rightPaddingClass} ${sizeClasses[size]}`;
  
  return (
    <div className={`relative ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={props.id} 
          className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
        >
          {label}
          {isRequired && <span className="ml-1 text-danger-500">*</span>}
        </label>
      )}
      
      <div className="relative rounded-md">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className={`${error ? 'text-danger-500' : 'text-gray-500'} sm:text-sm`}>
              {leftIcon}
            </span>
          </div>
        )}
        
        <input
          ref={ref}
          className={`
            block w-full border rounded-lg 
            transition-all duration-200
            focus:outline-none
            ${errorClasses}
            ${paddingClasses}
            ${props.disabled ? 'bg-gray-100 cursor-not-allowed opacity-70' : ''}
            ${className}
          `}
          onFocus={(e) => {
            setIsFocused(true);
            if (props.onFocus) props.onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            if (props.onBlur) props.onBlur(e);
          }}
          {...props}
        />
        
        {rightIcon && (
          <div 
            className={`absolute inset-y-0 right-0 pr-3 flex items-center ${clickableRightIcon ? 'cursor-pointer' : 'pointer-events-none'}`}
            onClick={clickableRightIcon && onRightIconClick ? onRightIconClick : undefined}
          >
            <span className={`${error ? 'text-danger-500' : 'text-gray-500'} sm:text-sm transition-colors ${clickableRightIcon ? 'hover:text-primary-500 active:text-primary-600' : ''}`}>
              {rightIcon}
            </span>
          </div>
        )}
      </div>
      
      {(helperText || errorMessage) && (
        <p className={`mt-1 text-xs ${error ? 'text-danger-600' : 'text-gray-500'}`}>
          {error ? errorMessage : helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;