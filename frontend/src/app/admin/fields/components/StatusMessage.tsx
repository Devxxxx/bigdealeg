'use client'

import { FaCheck, FaTimes } from 'react-icons/fa'

type StatusMessageProps = {
  message: string
  type: 'success' | 'error'
}

export default function StatusMessage({ message, type }: StatusMessageProps) {
  if (!message) return null
  
  return (
    <div className={`
      bg-${type === 'success' ? 'green' : 'red'}-50 
      border-l-4 
      border-${type === 'success' ? 'green' : 'red'}-400 
      p-4 
      rounded-md 
      shadow-sm 
      animate-fadeIn
      mb-4
    `}>
      <div className="flex items-center">
        {type === 'success' ? (
          <FaCheck className="h-5 w-5 text-green-400 mr-3" />
        ) : (
          <FaTimes className="h-5 w-5 text-red-400 mr-3" />
        )}
        <p className={`text-sm text-${type === 'success' ? 'green' : 'red'}-700`}>{message}</p>
      </div>
    </div>
  )
}
