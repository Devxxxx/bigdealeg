'use client'

import { useState } from 'react'
import { FiX, FiAlertCircle, FiCheck } from 'react-icons/fi'
import Button from '@/components/common/Button'
import { useAuth } from '@/hooks/useAuth'
import scheduledViewingApi from '@/lib/api/scheduledViewing'

export default function CancelViewingModal({ isOpen, onClose, viewingId, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [reason, setReason] = useState('')
  const [success, setSuccess] = useState(false)
  const { session } = useAuth()
  
  const handleCancel = async () => {
    if (!viewingId || !session?.access_token) return
    
    setLoading(true)
    setError(null)
    
    try {
      // Use our API client instead of direct Supabase access
      const cancelData = {
        cancellation_reason: reason
      }
      
      await scheduledViewingApi.cancelScheduledViewing(
        session.access_token,
        viewingId,
        cancelData
      )
      
      setSuccess(true)
      
      // Call the onSuccess callback after a small delay
      setTimeout(() => {
        if (onSuccess) onSuccess()
      }, 2000)
    } catch (err) {
      console.error('Error cancelling viewing:', err)
      setError('Failed to cancel viewing. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>
        
        {/* Modal panel */}
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          {/* Modal header */}
          <div className="bg-red-50 px-4 py-3 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg font-medium text-red-900 flex items-center">
              <FiAlertCircle className="mr-2 h-5 w-5 text-red-600" />
              Cancel Viewing Appointment
            </h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
          
          {/* Modal body */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {success ? (
              <div className="text-center py-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <FiCheck className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Viewing Cancelled</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Your viewing appointment has been successfully cancelled. If you change your mind, you can always request a new viewing.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500 mb-4">
                  Are you sure you want to cancel this viewing appointment? This action cannot be undone.
                </p>
                
                <div className="mt-4">
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for cancellation (optional)
                  </label>
                  <textarea
                    id="reason"
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Please let us know why you're cancelling..."
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  ></textarea>
                </div>
                
                {error && (
                  <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {error}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Modal footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {success ? (
              <Button 
                variant="primary"
                onClick={onClose}
              >
                Done
              </Button>
            ) : (
              <>
                <Button 
                  variant="danger"
                  onClick={handleCancel}
                  loading={loading}
                >
                  {loading ? 'Cancelling...' : 'Confirm Cancellation'}
                </Button>
                <Button 
                  variant="light"
                  onClick={onClose}
                  className="mr-2"
                >
                  Back
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}