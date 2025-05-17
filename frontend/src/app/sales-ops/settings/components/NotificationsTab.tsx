'use client'

import { useState } from 'react'
import { FaSave, FaBell } from 'react-icons/fa'

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

type NotificationsTabProps = {
  settings: NotificationSettings
  loading: boolean
  saving: boolean
  onSave: (settings: NotificationSettings) => Promise<void>
}

export default function NotificationsTab({ settings, loading, saving, onSave }: NotificationsTabProps) {
  const [formData, setFormData] = useState<NotificationSettings>(settings)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData({
      ...formData,
      [name]: checked
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
        <h3 className="text-lg leading-6 font-medium text-gray-900">Notification Preferences</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Manage your notification settings
        </p>
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 flex items-center">
              <FaBell className="mr-2 h-4 w-4 text-primary" />
              Email Notifications
            </h4>
            <p className="mt-1 text-xs text-gray-500 mb-4">
              Configure which email notifications you'd like to receive
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="email_new_request"
                    name="email_new_request"
                    type="checkbox"
                    checked={formData.email_new_request}
                    onChange={handleChange}
                    className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="email_new_request" className="font-medium text-gray-700">
                    New Property Requests
                  </label>
                  <p className="text-gray-500">
                    Notify me when a new property request is submitted
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="email_request_updates"
                    name="email_request_updates"
                    type="checkbox"
                    checked={formData.email_request_updates}
                    onChange={handleChange}
                    className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="email_request_updates" className="font-medium text-gray-700">
                    Request Updates
                  </label>
                  <p className="text-gray-500">
                    Notify me when there are updates to existing property requests
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="email_viewing_scheduled"
                    name="email_viewing_scheduled"
                    type="checkbox"
                    checked={formData.email_viewing_scheduled}
                    onChange={handleChange}
                    className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="email_viewing_scheduled" className="font-medium text-gray-700">
                    Viewing Scheduled
                  </label>
                  <p className="text-gray-500">
                    Notify me when a customer schedules a property viewing
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="email_viewing_confirmed"
                    name="email_viewing_confirmed"
                    type="checkbox"
                    checked={formData.email_viewing_confirmed}
                    onChange={handleChange}
                    className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="email_viewing_confirmed" className="font-medium text-gray-700">
                    Viewing Confirmed
                  </label>
                  <p className="text-gray-500">
                    Notify me when a property viewing is confirmed
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="email_viewing_cancelled"
                    name="email_viewing_cancelled"
                    type="checkbox"
                    checked={formData.email_viewing_cancelled}
                    onChange={handleChange}
                    className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="email_viewing_cancelled" className="font-medium text-gray-700">
                    Viewing Cancelled
                  </label>
                  <p className="text-gray-500">
                    Notify me when a property viewing is cancelled
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="email_message_received"
                    name="email_message_received"
                    type="checkbox"
                    checked={formData.email_message_received}
                    onChange={handleChange}
                    className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="email_message_received" className="font-medium text-gray-700">
                    Messages Received
                  </label>
                  <p className="text-gray-500">
                    Notify me when I receive new messages from customers
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <h4 className="text-sm font-medium text-gray-900 flex items-center">
              <FaBell className="mr-2 h-4 w-4 text-primary" />
              SMS Notifications
            </h4>
            <p className="mt-1 text-xs text-gray-500 mb-4">
              Configure which SMS notifications you'd like to receive
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="sms_viewing_reminder"
                    name="sms_viewing_reminder"
                    type="checkbox"
                    checked={formData.sms_viewing_reminder}
                    onChange={handleChange}
                    className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="sms_viewing_reminder" className="font-medium text-gray-700">
                    Viewing Reminders
                  </label>
                  <p className="text-gray-500">
                    Send me SMS reminders before scheduled property viewings
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="sms_viewing_changes"
                    name="sms_viewing_changes"
                    type="checkbox"
                    checked={formData.sms_viewing_changes}
                    onChange={handleChange}
                    className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="sms_viewing_changes" className="font-medium text-gray-700">
                    Viewing Changes
                  </label>
                  <p className="text-gray-500">
                    Send me SMS alerts when there are changes to scheduled viewings
                  </p>
                </div>
              </div>
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
                  Save Preferences
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
