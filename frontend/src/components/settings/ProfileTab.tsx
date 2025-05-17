'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiUser, FiSave, FiCamera } from 'react-icons/fi'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import FormField from '@/components/common/FormField'
import { useSettings } from '@/hooks/useSettings'

export default function ProfileTab({ profile, setProfile, setSuccessMessage, setErrorMessage }) {
  const [saving, setSaving] = useState(false)
  const { updateProfile } = useSettings()
  
  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      // Update profile
      await updateProfile()

      setSuccessMessage('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      setErrorMessage('Failed to update profile: ' + (error.message || 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center">
          <FiUser className="h-5 w-5 text-primary-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleProfileUpdate}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <FormField 
                label="Profile Photo" 
                helpText="Update your profile picture" 
                span="full"
              >
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                      {profile.name?.charAt(0) || profile.email?.charAt(0) || 'U'}
                    </div>
                    <div className="absolute -bottom-1 -right-1">
                      <button 
                        type="button"
                        className="bg-white rounded-full p-1.5 shadow-md border border-gray-200 text-primary-500 hover:text-primary-600"
                      >
                        <FiCamera className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">
                      JPG, PNG or GIF images up to 2MB
                    </p>
                    <Button
                      variant="light"
                      size="sm"
                      className="mt-2"
                    >
                      Upload Photo
                    </Button>
                  </div>
                </div>
              </FormField>

              <FormField 
                label="Full Name" 
                htmlFor="name" 
                span="full" 
                required
              >
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  required
                />
              </FormField>

              <FormField 
                label="Email Address" 
                htmlFor="email" 
                span="full"
                helpText="Email address cannot be changed"
              >
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="bg-gray-50"
                />
              </FormField>

              <FormField 
                label="Phone Number" 
                htmlFor="phone" 
                span="full"
                helpText="We'll use this number for viewing appointments and notifications"
              >
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </FormField>
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                type="submit"
                variant="gradient"
                leftIcon={<FiSave />}
                loading={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </motion.div>
  )
}