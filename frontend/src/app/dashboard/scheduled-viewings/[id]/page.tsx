'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import scheduledViewingApi from '@/lib/api/scheduledViewing'
import { 
  FiArrowLeft, 
  FiHome, 
  FiMapPin, 
  FiCalendar, 
  FiClock, 
  FiInfo, 
  FiCheck, 
  FiX, 
  FiPhone, 
  FiMail,
  FiAlertCircle,
  FiCheckCircle,
  FiExternalLink
} from 'react-icons/fi'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import CancelViewingModal from '@/components/viewings/CancelViewingModal'

export default function ViewingDetails() {
  const { id } = useParams()
  const router = useRouter()
  const { user, session } = useAuth()
  
  const [viewing, setViewing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  
  useEffect(() => {
    const fetchViewing = async () => {
      if (!user || !session?.access_token) return
      
      try {
        setLoading(true)
        
        // Use the API client instead of direct Supabase access
        const data = await scheduledViewingApi.getScheduledViewingById(
          session.access_token,
          id
        )
        
        console.log('Raw API response:', data)
        
        // The backend API response structure might be different from what the component expects
        // Ensure all property data is correctly mapped
        let processedData = { ...data }
        
        // If no property key exists but there's property_id with data, use that
        if (!processedData.property && processedData.property_id) {
          processedData.property = processedData.property_id
        }
        
        console.log('Processed data:', processedData)
        setViewing(processedData)
      } catch (err) {
        console.error('Error fetching viewing details:', err)
        setError('Failed to load viewing details')
      } finally {
        setLoading(false)
      }
    }
    
    fetchViewing()
  }, [id, user, session])
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Date pending'
    
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  const formatTime = (timeString) => {
    if (!timeString) return 'Time pending'
    
    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    
    return `${hour12}:${minutes} ${ampm}`
  }
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <FiCheck className="mr-1 h-4 w-4" />
            Confirmed
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <FiInfo className="mr-1 h-4 w-4" />
            Pending
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <FiX className="mr-1 h-4 w-4" />
            Cancelled
          </span>
        )
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <FiCheckCircle className="mr-1 h-4 w-4" />
            Completed
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        )
    }
  }
  
  const handleCancelSuccess = () => {
    // Update the local state
    setViewing({
      ...viewing,
      status: 'cancelled'
    })
    
    // Close the modal
    setCancelModalOpen(false)
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative h-16 w-16">
          <div className="absolute top-0 left-0 right-0 bottom-0 border-t-4 border-primary-500 border-solid rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 right-0 bottom-0 border-t-4 border-primary-200 border-solid rounded-full opacity-20"></div>
        </div>
      </div>
    )
  }
  
  if (error || !viewing) {
    return (
      <Card className="p-6 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <FiAlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="mt-2 text-lg font-medium text-gray-900">Viewing Not Found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The viewing appointment you're looking for doesn't exist or you don't have access to it.
        </p>
        <div className="mt-6">
          <Button
            variant="primary"
            onClick={() => router.push('/dashboard/scheduled-viewings')}
            leftIcon={<FiArrowLeft />}
          >
            Back to Viewings
          </Button>
        </div>
      </Card>
    )
  }
  
  // Debug: Display viewing object structure
  console.log('Viewing object structure:', viewing)
  console.log('Property info:', viewing.property)
  
  const isPastDate = (dateString) => {
    if (!dateString) return false
    
    const viewingDate = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return viewingDate < today
  }
  
  const canCancel = viewing.status === 'pending' || (viewing.status === 'confirmed' && !isPastDate(viewing.viewing_date))
  
  return (
    <div className="opacity-100 transition-opacity duration-500">
      <div className="mb-6">
        <Link
          href="/dashboard/scheduled-viewings"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <FiArrowLeft className="mr-2 h-4 w-4" />
          Back to Scheduled Viewings
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Viewing Details</h1>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold text-gray-900 mr-3">
                    {viewing.property ? viewing.property.title : 'Property Viewing'}
                  </h2>
                  {getStatusBadge(viewing.status)}
                </div>
                
                {canCancel && (
                  <Button
                    variant="danger"
                    size="sm"
                    className="mt-2 sm:mt-0"
                    leftIcon={<FiX />}
                    onClick={() => setCancelModalOpen(true)}
                  >
                    Cancel Viewing
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Viewing Details</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <FiCalendar className="h-5 w-5 text-primary-500 mt-0.5 mr-2" />
                        <div>
                          <div className="font-medium">Date</div>
                          <div className="text-gray-700">{formatDate(viewing.viewing_date)}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FiClock className="h-5 w-5 text-primary-500 mt-0.5 mr-2" />
                        <div>
                          <div className="font-medium">Time</div>
                          <div className="text-gray-700">{viewing.viewing_time ? formatTime(viewing.viewing_time) : 'Time pending'}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FiInfo className="h-5 w-5 text-primary-500 mt-0.5 mr-2" />
                        <div>
                          <div className="font-medium">Status</div>
                          <div className="text-gray-700">{viewing.status.charAt(0).toUpperCase() + viewing.status.slice(1)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Property Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <FiHome className="h-5 w-5 text-primary-500 mt-0.5 mr-2" />
                        <div>
                          <div className="font-medium">Type</div>
                          <div className="text-gray-700">{viewing.property ? viewing.property.property_type : 'Not specified'}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FiMapPin className="h-5 w-5 text-primary-500 mt-0.5 mr-2" />
                        <div>
                          <div className="font-medium">Location</div>
                          <div className="text-gray-700">{viewing.property ? viewing.property.location : 'Not specified'}</div>
                        </div>
                      </div>
                      
                      <div>
                        <Link
                          href={`/properties/${viewing.property_id}`}
                          className="text-primary-600 hover:text-primary-800 flex items-center"
                        >
                          View Property
                          <FiExternalLink className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {viewing.status === 'pending' && !viewing.viewing_date && viewing.preferred_dates && viewing.preferred_times && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Your Preferences</h3>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <FiCalendar className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                        <div>
                          <div className="font-medium">Preferred Dates</div>
                          <div className="text-gray-700">
                            {Array.isArray(viewing.preferred_dates) && viewing.preferred_dates.map(date => 
                              new Date(date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })
                            ).join(', ')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FiClock className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                        <div>
                          <div className="font-medium">Preferred Times</div>
                          <div className="text-gray-700">
                            {Array.isArray(viewing.preferred_times) && viewing.preferred_times.map(time => {
                              // Format each time (assuming 24h format like "10:00")
                              const [hours, minutes] = time.split(':')
                              const hour = parseInt(hours)
                              const ampm = hour >= 12 ? 'PM' : 'AM'
                              const hour12 = hour % 12 || 12
                              return `${hour12}:${minutes || '00'} ${ampm}`
                            }).join(', ')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-yellow-700 text-sm">
                        <FiInfo className="inline-block mr-1" />
                        Our sales team will review your preferred dates and times and confirm your appointment soon.
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {viewing.status === 'confirmed' && !isPastDate(viewing.viewing_date) && (
                <div className="bg-green-50 p-4 rounded-lg mb-6">
                  <div className="flex">
                    <FiCheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <div>
                      <div className="font-medium text-green-800">Your viewing is confirmed</div>
                      <div className="text-green-700 text-sm">
                        Please arrive on time. If you need to cancel or reschedule, please do so at least 24 hours in advance.
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {viewing.status === 'cancelled' && (
                <div className="bg-red-50 p-4 rounded-lg mb-6">
                  <div className="flex">
                    <FiX className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                    <div>
                      <div className="font-medium text-red-800">This viewing has been cancelled</div>
                      <div className="text-red-700 text-sm">
                        If you'd like to schedule a new viewing, please visit the property page and request a new appointment.
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {viewing.notes && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{viewing.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div>
          <Card>
            <div className="p-6">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <FiPhone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <div className="font-medium">Sales Team</div>
                    <div className="text-gray-600">+20 123 456 7890</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FiMail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-gray-600">viewings@bigdealegy.com</div>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <Button
                    variant="primary"
                    fullWidth
                    leftIcon={<FiPhone />}
                  >
                    Call Sales Team
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          
          {viewing.status === 'confirmed' && !isPastDate(viewing.viewing_date) && (
            <Card className="mt-6">
              <div className="p-6">
                <h3 className="text-md font-semibold text-gray-900 mb-4">What to Bring</h3>
                
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <FiCheck className="text-green-500 mr-2 mt-1" />
                    <span>Photo ID (National ID or Passport)</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheck className="text-green-500 mr-2 mt-1" />
                    <span>List of questions you want to ask</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheck className="text-green-500 mr-2 mt-1" />
                    <span>Measuring tape if needed</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheck className="text-green-500 mr-2 mt-1" />
                    <span>Smartphone for taking photos/videos</span>
                  </li>
                </ul>
              </div>
            </Card>
          )}
        </div>
      </div>
      
      <CancelViewingModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        viewingId={viewing?.id}
        onSuccess={handleCancelSuccess}
      />
    </div>
  )
}