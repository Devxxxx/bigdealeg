'use client'

import { FaInfoCircle } from 'react-icons/fa'

type GeneralSettingsProps = {
  settings: any
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  handleNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function GeneralSettings({ settings, handleChange, handleNumberChange }: GeneralSettingsProps) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaInfoCircle className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">About General Settings</h3>
            <p className="mt-2 text-sm text-blue-700">
              These settings control the basic information and functionality of your website.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div>
          <label htmlFor="site_name" className="block text-sm font-medium text-gray-700">
            Site Name
          </label>
          <input
            type="text"
            name="site_name"
            id="site_name"
            value={settings.site_name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="default_language" className="block text-sm font-medium text-gray-700">
            Default Language
          </label>
          <select
            id="default_language"
            name="default_language"
            value={settings.default_language}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
          >
            <option value="en">English</option>
            <option value="ar">Arabic</option>
            <option value="fr">French</option>
          </select>
        </div>
        
        <div className="sm:col-span-2">
          <label htmlFor="site_description" className="block text-sm font-medium text-gray-700">
            Site Description
          </label>
          <textarea
            id="site_description"
            name="site_description"
            rows={3}
            value={settings.site_description}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          ></textarea>
        </div>
        
        <div>
          <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700">
            Contact Email
          </label>
          <input
            type="email"
            name="contact_email"
            id="contact_email"
            value={settings.contact_email}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="support_phone" className="block text-sm font-medium text-gray-700">
            Support Phone
          </label>
          <input
            type="text"
            name="support_phone"
            id="support_phone"
            value={settings.support_phone}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="default_location" className="block text-sm font-medium text-gray-700">
            Default Location
          </label>
          <input
            type="text"
            name="default_location"
            id="default_location"
            value={settings.default_location}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="property_expiry_days" className="block text-sm font-medium text-gray-700">
            Property Expiry (days)
          </label>
          <input
            type="number"
            name="property_expiry_days"
            id="property_expiry_days"
            value={settings.property_expiry_days}
            onChange={handleNumberChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        
        <div className="sm:col-span-2">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="maintenance_mode"
                name="maintenance_mode"
                type="checkbox"
                checked={settings.maintenance_mode}
                onChange={handleChange}
                className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="maintenance_mode" className="font-medium text-gray-700">
                Maintenance Mode
              </label>
              <p className="text-gray-500">
                When enabled, the site will display a maintenance message to all users except administrators.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
