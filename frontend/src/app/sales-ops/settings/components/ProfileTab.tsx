'use client'

import { useState } from 'react'
import { FaUser, FaEnvelope, FaPhone, FaSave } from 'react-icons/fa'

type ProfileTabProps = {
  profile: {
    name: string
    email: string
    phone?: string
    profile_image?: string
  }
  loading: boolean
  saving: boolean
  onSave: (formData: { name: string, phone: string }) => Promise<void>
}

export default function ProfileTab({ profile, loading, saving, onSave }: ProfileTabProps) {
  const [formData, setFormData] = useState({
    name: profile.name || '',
    phone: profile.phone || ''
  })
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Update your personal information
        </p>
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {profile.profile_image ? (
                <img
                  className="h-16 w-16 rounded-full"
                  src={profile.profile_image}
                  alt="Profile"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                  <FaUser className="h-8 w-8 text-primary-600" />
                </div>
              )}
            </div>
            <div className="ml-6">
              <button
                type="button"
                className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Change
              </button>
              <p className="mt-1 text-xs text-gray-500">
                JPG, PNG or GIF. 1MB max.
              </p>
            </div>
          </div>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                id="name"
                className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md bg-gray-100"
                value={profile.email}
                disabled
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Email cannot be changed. Contact administrator for assistance.
            </p>
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                name="phone"
                id="phone"
                className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Your phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2 -ml-1 h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
