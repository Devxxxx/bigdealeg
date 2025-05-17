'use client'

import React from 'react'
import { twMerge } from 'tailwind-merge'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'outline' | 'elevated' | 'filled' | 'glass'
  isHoverable?: boolean
  isCompact?: boolean
  isRounded?: boolean
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  withBorder?: boolean
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
  className?: string
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  isCompact?: boolean
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  withBorder?: boolean
  align?: 'left' | 'center' | 'right' | 'between'
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  variant = 'default',
  isHoverable = false,
  isCompact = false,
  isRounded = true,
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'outline':
        return 'bg-white border border-gray-200';
      case 'elevated':
        return 'bg-white border border-gray-200 shadow-elevated';
      case 'filled':
        return 'bg-gray-50 border border-gray-200';
      case 'glass':
        return 'glass';
      default:
        return 'bg-white border border-gray-200 shadow-card';
    }
  };
  
  return (
    <div 
      className={twMerge(
        getVariantClasses(),
        isRounded ? 'rounded-xl' : '',
        isHoverable ? 'transition-all duration-200 hover:shadow-elevated hover:-translate-y-1' : '',
        'overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardHeader: React.FC<CardHeaderProps> = ({ 
  children, 
  className, 
  withBorder = true,
  ...props 
}) => {
  return (
    <div 
      className={twMerge(
        'px-6 py-4', 
        withBorder ? 'border-b border-gray-200' : '',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardTitle: React.FC<CardTitleProps> = ({ 
  children, 
  className, 
  as: Component = 'h3',
  ...props 
}) => {
  return (
    <Component 
      className={twMerge(
        'font-display text-lg font-semibold text-gray-900',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ 
  children, 
  className,
  ...props 
}) => {
  return (
    <p 
      className={twMerge(
        'mt-1 text-sm text-gray-500',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

export const CardContent: React.FC<CardContentProps> = ({ 
  children, 
  className,
  isCompact = false,
  ...props 
}) => {
  return (
    <div 
      className={twMerge(
        isCompact ? 'p-4' : 'px-6 py-5', 
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardFooter: React.FC<CardFooterProps> = ({ 
  children, 
  className,
  withBorder = true,
  align = 'right',
  ...props 
}) => {
  const getAlignmentClasses = () => {
    switch (align) {
      case 'left':
        return 'text-left';
      case 'center':
        return 'text-center';
      case 'between':
        return 'flex justify-between items-center';
      default:
        return 'text-right';
    }
  };
  
  return (
    <div 
      className={twMerge(
        'px-6 py-4', 
        withBorder ? 'border-t border-gray-200 bg-gray-50' : '',
        getAlignmentClasses(),
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Object.assign(Card, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter
})