'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProfileTab from '@/components/settings/ProfileTab'
import SecurityTab from '@/components/settings/SecurityTab'
import NotificationsTab from '@/components/settings/NotificationsTab'
import AccountTab from '@/components/settings/AccountTab'
import { useSettings } from '@/hooks/useSettings'
import { 
  FiUser, 
  FiShield, 
  FiBell, 
  FiSettings,
  FiAlertCircle,
  FiCheckCircle
} from 'react-icons/fi'

export default function Settings() {
  const { 
    loading, 
    profile, 
    setProfile, 
    notifications, 
    setNotifications,
    sessionData,
    refreshSettings
  } = useSettings()
  const [activeTab, setActiveTab] = useState('profile') // 'profile', 'security', 'notifications', 'account'
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Clear messages when tab changes
  useEffect(() => {
    setSuccessMessage('')
    setErrorMessage('')
  }, [activeTab])

  // Tab components with props
  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'security', label: 'Security', icon: FiShield },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'account', label: 'Account', icon: FiSettings }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account preferences and profile information</p>
      </div>

      {/* Success/Error Messages */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mb-4 bg-green-50 border-l-4 border-green-400 p-4 rounded-md"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <FiCheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-md"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Navigation */}
      <div className="mb-6 flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-3 text-sm font-medium -mb-px ${
              activeTab === tab.id
                ? 'text-primary-600 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
            }`}
          >
            <tab.icon className={`mr-2 h-5 w-5 ${activeTab === tab.id ? 'text-primary-500' : 'text-gray-400'}`} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative h-16 w-16">
            <div className="absolute top-0 left-0 right-0 bottom-0 border-t-4 border-primary-500 border-solid rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 right-0 bottom-0 border-t-4 border-primary-200 border-solid rounded-full opacity-20"></div>
          </div>
        </div>
      ) : (
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <ProfileTab 
                key="profile" 
                profile={profile} 
                setProfile={setProfile} 
                setSuccessMessage={setSuccessMessage}
                setErrorMessage={setErrorMessage}
              />
            )}
            
            {activeTab === 'security' && (
              <SecurityTab 
                key="security" 
                setSuccessMessage={setSuccessMessage}
                setErrorMessage={setErrorMessage}
                sessionData={sessionData}
              />
            )}
            
            {activeTab === 'notifications' && (
              <NotificationsTab 
                key="notifications" 
                notifications={notifications} 
                setNotifications={setNotifications} 
                setSuccessMessage={setSuccessMessage}
                setErrorMessage={setErrorMessage}
              />
            )}
            
            {activeTab === 'account' && (
              <AccountTab 
                key="account" 
                setSuccessMessage={setSuccessMessage}
                setErrorMessage={setErrorMessage}
              />
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}