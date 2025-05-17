'use client'

import { FaInfoCircle } from 'react-icons/fa'

type UploadSettingsProps = {
  settings: any
  handleNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function UploadSettings({ settings, handleNumberChange }: UploadSettingsProps) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaInfoCircle className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Upload Configuration</h3>
            <p className="mt-2 text-sm text-blue-700">
              Configure image upload limits and restrictions for property listings.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div>
          <label htmlFor="max_upload_size" className="block text-sm font-medium text-gray-700">
            Maximum Upload Size (MB)
          </label>
          <input
            type="number"
            name="max_upload_size"
            id="max_upload_size"
            value={settings.max_upload_size}
            onChange={handleNumberChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            min="1"
            max="50"
          />
        </div>
        
        <div>
          <label htmlFor="max_images_per_property" className="block text-sm font-medium text-gray-700">
            Max Images Per Property
          </label>
          <input
            type="number"
            name="max_images_per_property"
            id="max_images_per_property"
            value={settings.max_images_per_property}
            onChange={handleNumberChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            min="1"
            max="50"
          />
        </div>
      </div>
    </div>
  )
}
