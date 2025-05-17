'use client'

import React from 'react'
import { twMerge } from 'tailwind-merge'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
  icon?: React.ReactNode
  className?: string
}

const variants = {
  default: 'bg-gray-100 text-gray-800',
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800'
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  icon,
  className
}) => {
  return (
    <span
      className={twMerge(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {icon && <span className="mr-1 -ml-0.5">{icon}</span>}
      {children}
    </span>
  )
}

export default Badge