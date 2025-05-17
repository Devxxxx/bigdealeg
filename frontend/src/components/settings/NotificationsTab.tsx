'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiBell, FiSave, FiMail, FiMessageSquare, FiInfo, FiAlertCircle } from 'react-icons/fi'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import FormField from '@/components/common/FormField'
import { useSettings } from '@/hooks/useSettings'

export default function NotificationsTab({ notifications, setNotifications, setSuccessMessage, setErrorMessage }) {
  const [saving, setSaving] = useState(false)
  const { updateNotifications } = useSettings()

  // Handle notification settings update
  const handleNotificationUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      await updateNotifications()
      setSuccessMessage('Notification settings updated successfully')
    } catch (error) {
      console.error('Error updating notification settings:', error)
      setErrorMessage('Failed to update notification settings: ' + (error.message || 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  // Toggle setting
  const toggleSetting = (setting) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }))
  }

  return (
    <motion.div
      key="notifications"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center">
          <FiBell className="h-5 w-5 text-primary-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleNotificationUpdate}>
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-5">
                <h4 className="text-sm font-medium text-gray-700 mb-4">Notification Channels</h4>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="email_notifications"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={notifications.email_notifications}
                        onChange={() => toggleSetting('email_notifications')}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="email_notifications" className="text-sm font-medium text-gray-700 flex items-center">
                        <FiMail className="mr-2 text-gray-400" />
                        Email Notifications
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Receive notifications and updates via email
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="sms_notifications"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={notifications.sms_notifications}
                        onChange={() => toggleSetting('sms_notifications')}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="sms_notifications" className="text-sm font-medium text-gray-700 flex items-center">
                        <FiMessageSquare className="mr-2 text-gray-400" />
                        SMS Notifications
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Receive important notifications via SMS
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="push_notifications"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={notifications.push_notifications}
                        onChange={() => toggleSetting('push_notifications')}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="push_notifications" className="text-sm font-medium text-gray-700 flex items-center">
                        <FiBell className="mr-2 text-gray-400" />
                        Push Notifications
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Receive notifications in your browser even when you're not on our site
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-5">
                <h4 className="text-sm font-medium text-gray-700 mb-4">Notification Types</h4>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="request_updates"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={notifications.request_updates}
                        onChange={() => toggleSetting('request_updates')}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="request_updates" className="text-sm font-medium text-gray-700">
                        Property Request Updates
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Receive updates when your property requests status changes or when matching properties are found
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="viewing_reminders"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={notifications.viewing_reminders}
                        onChange={() => toggleSetting('viewing_reminders')}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="viewing_reminders" className="text-sm font-medium text-gray-700">
                        Viewing Reminders
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Receive reminders about upcoming property viewings
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-4">Marketing Communications</h4>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="marketing_emails"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={notifications.marketing_emails}
                      onChange={() => toggleSetting('marketing_emails')}
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="marketing_emails" className="text-sm font-medium text-gray-700">
                      Marketing Emails
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Receive promotional emails, special offers, and market updates
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiInfo className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Important Information</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        We may still send you important notifications about your account and transactions, even if you've disabled certain notification preferences.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  leftIcon={<FiSave />}
                  loading={saving}
                >
                  {saving ? 'Saving...' : 'Save Preferences'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Card>
    </motion.div>
  )
}