'use client'

import React from 'react'
import { twMerge } from 'tailwind-merge'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  className?: string
  containerClassName?: string
  labelClassName?: string
  errorClassName?: string
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className,
  containerClassName,
  labelClassName,
  errorClassName,
  ...props
}) => {
  return (
    <div className={twMerge('', containerClassName)}>
      {label && (
        <label
          htmlFor={props.id}
          className={twMerge('block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1', labelClassName)}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={twMerge(
            'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm',
            icon ? 'pl-10' : '',
            error ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : '',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className={twMerge('mt-2 text-sm text-red-600', errorClassName)}>
          {error}
        </p>
      )}
    </div>
  )
}

export default Input