'use client'

import { FaInfoCircle } from 'react-icons/fa'

type PrivacySettingsProps = {
  settings: any
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
}

export default function PrivacySettings({ settings, handleChange }: PrivacySettingsProps) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaInfoCircle className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Privacy Configuration</h3>
            <p className="mt-2 text-sm text-blue-700">
              Configure user data privacy settings and login options.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="enable_social_login"
                name="enable_social_login"
                type="checkbox"
                checked={settings.enable_social_login}
                onChange={handleChange}
                className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="enable_social_login" className="font-medium text-gray-700">
                Enable Social Login
              </label>
              <p className="text-gray-500">
                Allow users to sign in with Google, Facebook, and other social accounts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
