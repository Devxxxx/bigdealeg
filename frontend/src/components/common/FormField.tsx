import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

type FormFieldProps = {
  children: ReactNode;
  label?: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  className?: string;
  required?: boolean;
  span?: 'full' | 'half' | 'third' | 'quarter';
  helpText?: string;
  showHelpIcon?: boolean;
  animate?: boolean;
};

export default function FormField({
  children,
  label,
  htmlFor,
  error,
  hint,
  className = '',
  required = false,
  span = 'full',
  helpText,
  showHelpIcon = false,
  animate = false
}: FormFieldProps) {
  const [showHelp, setShowHelp] = React.useState(false);
  
  const spanClasses = {
    full: 'col-span-12',
    half: 'col-span-12 md:col-span-6',
    third: 'col-span-12 md:col-span-4',
    quarter: 'col-span-12 md:col-span-3'
  };

  const FieldContent = () => (
    <>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label 
            htmlFor={htmlFor} 
            className="block text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          {showHelpIcon && helpText && (
            <div className="relative">
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                onMouseEnter={() => setShowHelp(true)}
                onMouseLeave={() => setShowHelp(false)}
                onClick={() => setShowHelp(!showHelp)}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </button>
              
              {showHelp && (
                <div className="absolute z-10 right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-3 text-xs text-gray-600 border border-gray-200">
                  {helpText}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {children}
      
      {hint && !error && (
        <p className="mt-1.5 text-xs text-gray-500">{hint}</p>
      )}
      
      {error && (
        <motion.p 
          initial={animate ? { opacity: 0, y: -10 } : undefined}
          animate={animate ? { opacity: 1, y: 0 } : undefined}
          className="mt-1.5 text-xs text-red-600 flex items-center"
        >
          <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </motion.p>
      )}
      
      {helpText && !showHelpIcon && (
        <p className="mt-1.5 text-xs text-gray-500">{helpText}</p>
      )}
    </>
  );

  if (animate) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`mb-4 ${spanClasses[span]} ${className}`}
      >
        <FieldContent />
      </motion.div>
    );
  }

  return (
    <div className={`mb-4 ${spanClasses[span]} ${className}`}>
      <FieldContent />
    </div>
  );
}