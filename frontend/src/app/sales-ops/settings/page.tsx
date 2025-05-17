'use client'

import { useState, useEffect } from 'react'
import { FaCog } from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'
import settingsApi from '@/lib/api/settings'

// Import components
import ProfileTab from './components/ProfileTab'
import NotificationsTab from './components/NotificationsTab'
import SecurityTab from './components/SecurityTab'
import StatusMessage from './components/StatusMessage'
import TabBar from './components/TabBar'

// Types
type NotificationSettings = {
  email_new_request: boolean
  email_request_updates: boolean
  email_viewing_scheduled: boolean
  email_viewing_confirmed: boolean
  email_viewing_cancelled: boolean
  email_message_received: boolean
  sms_viewing_reminder: boolean
  sms_viewing_changes: boolean
}

type UserProfile = {
  id: string
  name: string
  email: string
  phone?: string
  profile_image?: string
  role: string
  notification_settings?: NotificationSettings
}

export default function SalesOpsSettings() {
  const { session } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile')
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  
  // Default notification settings
  const defaultNotificationSettings: NotificationSettings = {
    email_new_request: true,
    email_request_updates: true,
    email_viewing_scheduled: true,
    email_viewing_confirmed: true,
    email_viewing_cancelled: true,
    email_message_received: true,
    sms_viewing_reminder: false,
    sms_viewing_changes: false
  }
  
  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(defaultNotificationSettings)
  
  // Fetch user profile and settings
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.access_token) return;
      
      try {
        setLoading(true)
        
        // Get user settings from backend API
        const { settings } = await settingsApi.getUserSettings(session.access_token)
        
        if (!settings) {
          throw new Error('Failed to load user settings')
        }
        
        setUserProfile(settings.profile)
        
        // Set notification settings
        if (settings.notifications) {
          setNotificationSettings(settings.notifications)
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching user profile:', error)
        setLoading(false)
        setErrorMessage('Failed to load user profile')
      }
    }
    
    fetchUserProfile()
  }, [session])
  
  // Update profile
  const handleUpdateProfile = async (formData: { name: string, phone: string }) => {
    if (!userProfile || !session?.access_token) return
    
    try {
      setSaving(true)
      setErrorMessage('')
      setSuccessMessage('')
      
      const { profile } = await settingsApi.updateUserProfile(
        session.access_token,
        {
          name: formData.name,
          phone: formData.phone
        }
      )
      
      // Update local state
      setUserProfile({
        ...userProfile,
        name: profile.name,
        phone: profile.phone
      })
      
      setSuccessMessage('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      setErrorMessage('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }
  
  // Update notification settings
  const handleUpdateNotifications = async (settings: NotificationSettings) => {
    if (!userProfile || !session?.access_token) return
    
    try {
      setSaving(true)
      setErrorMessage('')
      setSuccessMessage('')
      
      await settingsApi.updateNotificationSettings(
        session.access_token,
        settings
      )
      
      // Update local state
      setNotificationSettings(settings)
      setUserProfile({
        ...userProfile,
        notification_settings: settings
      })
      
      setSuccessMessage('Notification preferences updated successfully')
    } catch (error) {
      console.error('Error updating notification settings:', error)
      setErrorMessage('Failed to update notification preferences')
    } finally {
      setSaving(false)
    }
  }
  
  // Update password
  const handleUpdatePassword = async (passwords: { current_password: string, new_password: string }) => {
    if (!session?.access_token) return
    
    try {
      setSaving(true)
      setErrorMessage('')
      setSuccessMessage('')
      
      await settingsApi.updatePassword(
        session.access_token,
        {
          current_password: passwords.current_password,
          new_password: passwords.new_password
        }
      )
      
      setSuccessMessage('Password updated successfully')
    } catch (error: any) {
      console.error('Error updating password:', error)
      setErrorMessage(error.message || 'Failed to update password')
    } finally {
      setSaving(false)
    }
  }
  
  // Clear messages after 5 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout
    
    if (successMessage) {
      timer = setTimeout(() => {
        setSuccessMessage('')
      }, 5000)
    }
    
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [successMessage])
  
  useEffect(() => {
    let timer: NodeJS.Timeout
    
    if (errorMessage) {
      timer = setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
    
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [errorMessage])
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaCog className="mr-3 text-primary" />
            Account Settings
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>
      </div>
      
      {/* Status Messages */}
      <StatusMessage 
        successMessage={successMessage}
        errorMessage={errorMessage}
      />
      
      {/* Settings Panel */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Tabs */}
        <TabBar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        
        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'profile' && userProfile && (
            <ProfileTab
              profile={userProfile}
              loading={loading}
              saving={saving}
              onSave={handleUpdateProfile}
            />
          )}
          
          {activeTab === 'notifications' && (
            <NotificationsTab
              settings={notificationSettings}
              loading={loading}
              saving={saving}
              onSave={handleUpdateNotifications}
            />
          )}
          
          {activeTab === 'security' && (
            <SecurityTab
              loading={loading}
              saving={saving}
              onSave={handleUpdatePassword}
            />
          )}
          
          {loading && (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
