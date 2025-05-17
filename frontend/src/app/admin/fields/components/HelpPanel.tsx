'use client'

import { useState } from 'react'
import { FaInfoCircle, FaTimes } from 'react-icons/fa'

export default function HelpPanel() {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="p-6 flex justify-between items-center">
        <div className="flex items-center">
          <FaInfoCircle className="h-5 w-5 text-blue-500 mr-3" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">Need help with form fields?</h3>
            <p className="text-sm text-gray-500 mt-1">
              Learn about how to create and manage form fields effectively
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {isVisible ? 'Hide Help' : 'Show Help'}
        </button>
      </div>

      {isVisible && (
        <div className="bg-blue-50 p-6 animate-fadeIn border-t border-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded shadow-sm">
              <h4 className="font-medium text-gray-800 mb-2">Field Name</h4>
              <p className="text-sm text-gray-600">Unique identifier for the field (no spaces, letters, numbers, and underscores only).</p>
            </div>
            
            <div className="bg-white p-4 rounded shadow-sm">
              <h4 className="font-medium text-gray-800 mb-2">Field Label</h4>
              <p className="text-sm text-gray-600">The text that appears above the field on the form.</p>
            </div>
            
            <div className="bg-white p-4 rounded shadow-sm">
              <h4 className="font-medium text-gray-800 mb-2">Field Types</h4>
              <p className="text-sm text-gray-600">Choose from text, number, dropdown, checkbox, or text area inputs.</p>
            </div>
            
            <div className="bg-white p-4 rounded shadow-sm">
              <h4 className="font-medium text-gray-800 mb-2">Field Order</h4>
              <p className="text-sm text-gray-600">Arrange fields by using the up/down arrows to change display order.</p>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium text-gray-800 mb-2">Best Practices</h4>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              <li>Keep field labels clear and concise</li>
              <li>Group related fields together with similar order numbers</li>
              <li>Use help text to clarify what information is needed</li>
              <li>Only mark fields as required when the information is essential</li>
              <li>For dropdown fields, list the most common options first</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
