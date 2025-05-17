'use client'

import { FaInfoCircle } from 'react-icons/fa'

export default function ApiSettings() {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaInfoCircle className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">API Configuration</h3>
            <p className="mt-2 text-sm text-blue-700">
              Manage API keys and integration settings.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md">
        <p className="text-sm text-gray-700">
          API management is handled through the developer portal.
          Please contact your system administrator for access.
        </p>
      </div>
    </div>
  )
}
