'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSettings, FiDownload, FiTrash2, FiAlertTriangle, FiLogOut } from 'react-icons/fi'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'

export default function AccountTab({ user, supabase, setSuccessMessage, setErrorMessage }) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('')
  const [isExportingData, setIsExportingData] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Handle data export
  const handleExportData = async () => {
    try {
      setIsExportingData(true)
      setSuccessMessage('')
      
      // Fetch user profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (profileError) throw profileError
      
      // Fetch user property requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('property_requests')
        .select('*')
        .eq('user_id', user.id)
      
      if (requestsError) throw requestsError
      
      // Fetch scheduled viewings
      const { data: viewingsData, error: viewingsError } = await supabase
        .from('scheduled_viewings')
        .select('*')
        .eq('user_id', user.id)
      
      if (viewingsError) throw viewingsError
      
      // Fetch user settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      // Create the export data object
      const exportData = {
        profile: profileData,
        propertyRequests: requestsData || [],
        scheduledViewings: viewingsData || [],
        settings: settingsData || {}
      }
      
      // Create a downloadable file
      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      
      // Create download link and trigger download
      const link = document.createElement('a')
      link.href = url
      link.download = `bigdealegy-account-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      setSuccessMessage('Account data exported successfully')
    } catch (error) {
      console.error('Error exporting account data:', error)
      setErrorMessage('Failed to export account data')
    } finally {
      setIsExportingData(false)
    }
  }
  
  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (deleteConfirmationText !== 'delete my account') {
      setErrorMessage('Please type "delete my account" to confirm')
      return
    }
    
    try {
      setIsDeleting(true)
      setErrorMessage('')
      
      // In a real implementation, you would delete the user's account data
      // For demo purposes, we'll just show a success message
      
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSuccessMessage('Your account has been scheduled for deletion. You will be logged out shortly.')
      
      // In a real implementation, you would sign out the user and redirect them
      setTimeout(() => {
        supabase.auth.signOut()
      }, 3000)
      
    } catch (error) {
      console.error('Error deleting account:', error)
      setErrorMessage('Failed to delete account')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirmation(false)
    }
  }

  return (
    <motion.div
      key="account"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Account Data Export */}
      <Card className="overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center">
          <FiDownload className="h-5 w-5 text-primary-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Export Account Data</h3>
        </div>
        
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            You can export all your personal data including your profile information, property requests, scheduled viewings, and settings.
            The data will be exported as a JSON file.
          </p>
          
          <Button
            variant="outline"
            leftIcon={<FiDownload />}
            onClick={handleExportData}
            loading={isExportingData}
          >
            {isExportingData ? 'Exporting...' : 'Export My Data'}
          </Button>
        </div>
      </Card>
      
      {/* Account Deactivation */}
      <Card className="overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center">
          <FiTrash2 className="h-5 w-5 text-red-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
        </div>
        
        <div className="p-6">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Warning: This action cannot be undone</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    Deleting your account will permanently remove all your data including:
                  </p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Your profile information</li>
                    <li>All property requests</li>
                    <li>Scheduled viewings</li>
                    <li>Notification preferences</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {!showDeleteConfirmation ? (
            <Button
              variant="danger"
              leftIcon={<FiTrash2 />}
              onClick={() => setShowDeleteConfirmation(true)}
            >
              Delete My Account
            </Button>
          ) : (
            <div className="border border-red-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Confirm Account Deletion</h4>
              <p className="text-sm text-gray-600 mb-4">
                Please type <span className="font-medium">delete my account</span> to confirm deletion.
              </p>
              
              <input
                type="text"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                placeholder="Type 'delete my account'"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm mb-4"
              />
              
              <div className="flex space-x-3">
                <Button
                  variant="danger"
                  leftIcon={<FiTrash2 />}
                  onClick={handleDeleteAccount}
                  loading={isDeleting}
                  disabled={deleteConfirmationText !== 'delete my account'}
                >
                  {isDeleting ? 'Deleting...' : 'Permanently Delete Account'}
                </Button>
                
                <Button
                  variant="light"
                  onClick={() => {
                    setShowDeleteConfirmation(false);
                    setDeleteConfirmationText('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
      
      {/* Account Logout */}
      <Card className="overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center">
          <FiLogOut className="h-5 w-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Sign Out</h3>
        </div>
        
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Sign out from your account on this device.
          </p>
          
          <Button
            variant="light"
            leftIcon={<FiLogOut />}
            onClick={() => supabase.auth.signOut()}
          >
            Sign Out
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}