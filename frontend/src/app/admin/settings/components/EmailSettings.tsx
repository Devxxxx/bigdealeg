'use client'

import { FaInfoCircle } from 'react-icons/fa'

type EmailSettingsProps = {
  settings: any
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
}

export default function EmailSettings({ settings, handleChange }: EmailSettingsProps) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaInfoCircle className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Email Configuration</h3>
            <p className="mt-2 text-sm text-blue-700">
              Configure email settings to enable notifications and communication with users.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="enable_email_notifications"
                name="enable_email_notifications"
                type="checkbox"
                checked={settings.enable_email_notifications}
                onChange={handleChange}
                className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="enable_email_notifications" className="font-medium text-gray-700">
                Enable Email Notifications
              </label>
              <p className="text-gray-500">
                Send automated emails for property updates, viewing confirmations, and other important events.
              </p>
            </div>
          </div>
        </div>
        
        <div className="sm:col-span-2">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="enable_sms_notifications"
                name="enable_sms_notifications"
                type="checkbox"
                checked={settings.enable_sms_notifications}
                onChange={handleChange}
                className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="enable_sms_notifications" className="font-medium text-gray-700">
                Enable SMS Notifications
              </label>
              <p className="text-gray-500">
                Send text messages for urgent updates and viewing confirmations (requires SMS provider).
              </p>
            </div>
          </div>
        </div>
        
        <div className="sm:col-span-2">
          <p className="mt-4 text-sm text-gray-500">
            Advanced email settings (SMTP configuration, email templates, etc.) are managed in the email
            service provider dashboard.
          </p>
        </div>
      </div>
    </div>
  )
}
