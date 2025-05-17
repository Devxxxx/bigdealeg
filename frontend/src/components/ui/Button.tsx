'use client'

import React from 'react'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning' | 'accent' | 'gradient'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  isFullWidth?: boolean
  isRounded?: boolean
  hasShadow?: boolean
  className?: string
  children: React.ReactNode
}

interface LinkButtonProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning' | 'accent' | 'gradient'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  isFullWidth?: boolean
  isRounded?: boolean
  hasShadow?: boolean
  className?: string
  children: React.ReactNode
}

const variants = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
  secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white focus:ring-secondary-500',
  accent: 'bg-accent-600 hover:bg-accent-700 text-white focus:ring-accent-500',
  outline: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 focus:ring-primary-500',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500',
  danger: 'bg-danger-600 hover:bg-danger-700 text-white focus:ring-danger-500',
  success: 'bg-success-600 hover:bg-success-700 text-white focus:ring-success-500',
  warning: 'bg-warning-500 hover:bg-warning-600 text-white focus:ring-warning-500',
  gradient: 'bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white focus:ring-primary-500'
}

const sizes = {
  xs: 'py-1 px-2.5 text-xs',
  sm: 'py-1.5 px-3 text-sm',
  md: 'py-2 px-4 text-sm',
  lg: 'py-2.5 px-5 text-base',
  xl: 'py-3 px-6 text-base'
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  isFullWidth = false,
  isRounded = false,
  hasShadow = true,
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={twMerge(
        'inline-flex items-center justify-center font-medium transition-all',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]',
        variants[variant],
        sizes[size],
        isFullWidth ? 'w-full' : '',
        isRounded ? 'rounded-full' : 'rounded-lg',
        hasShadow ? 'shadow-sm hover:shadow' : '',
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : leftIcon ? (
        <span className="mr-2 -ml-1">{leftIcon}</span>
      ) : null}
      {children}
      {rightIcon && <span className="ml-2 -mr-1">{rightIcon}</span>}
    </button>
  )
}

export const LinkButton: React.FC<LinkButtonProps> = ({
  href,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  isFullWidth = false,
  isRounded = false,
  hasShadow = true,
  className,
  children,
  ...props
}) => {
  return (
    <Link
      href={href}
      className={twMerge(
        'inline-flex items-center justify-center font-medium transition-all',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'active:scale-[0.98]',
        variants[variant],
        sizes[size],
        isFullWidth ? 'w-full' : '',
        isRounded ? 'rounded-full' : 'rounded-lg',
        hasShadow ? 'shadow-sm hover:shadow' : '',
        className
      )}
      {...props}
    >
      {leftIcon && <span className="mr-2 -ml-1">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2 -mr-1">{rightIcon}</span>}
    </Link>
  )
}

export default Button