'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaClock, 
  FaUser, 
  FaHome, 
  FaMapMarkerAlt, 
  FaInfoCircle,
  FaSave,
  FaTimesCircle,
  FaCheckCircle 
} from 'react-icons/fa'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'

export default function ScheduleViewing() {
  const { supabase } = useSupabase()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get query parameters
  const requestId = searchParams.get('request')
  const userId = searchParams.get('user')
  const viewingId = searchParams.get('viewing')
  
  // State
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  // Data
  const [user, setUser] = useState(null)
  const [property, setProperty] = useState(null)
  const [request, setRequest] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [properties, setProperties] = useState([])
  
  // Form state
  const [selectedProperty, setSelectedProperty] = useState('')
  const [viewingDate, setViewingDate] = useState('')
  const [viewingTime, setViewingTime] = useState('')
  const [notes, setNotes] = useState('')
  const [privateNotes, setPrivateNotes] = useState('')
  const [status, setStatus] = useState('confirmed')
  
  // Get the min date (today) for the date picker
  const today = new Date().toISOString().split('T')[0]
  
  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // If we have a viewing ID, fetch the existing viewing
        if (viewingId) {
          const { data: viewingData, error: viewingError } = await supabase
            .from('scheduled_viewings')
            .select(`
              *,
              property:properties(*),
              profile:user_id(*)
            `)
            .eq('id', viewingId)
            .single()
          
          if (viewingError) throw viewingError
          
          setViewing(viewingData)
          setSelectedProperty(viewingData.property_id)
          setViewingDate(viewingData.viewing_date || '')
          setViewingTime(viewingData.viewing_time || '')
          setNotes(viewingData.notes || '')
          setPrivateNotes(viewingData.private_notes || '')
          setStatus(viewingData.status)
          setUser(viewingData.profile)
          setProperty(viewingData.property)
        } 
        // Otherwise, fetch data based on request and user IDs
        else if (requestId && userId) {
          // Fetch user data
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()
          
          if (userError) throw userError
          setUser(userData)
          
          // Fetch request data if available
          if (requestId !== 'null' && requestId !== 'undefined') {
            const { data: requestData, error: requestError } = await supabase
              .from('property_requests')
              .select('*')
              .eq('id', requestId)
              .single()
            
            if (!requestError) {
              setRequest(requestData)
            }
          }
          
          // Fetch available properties
          const { data: propertiesData, error: propertiesError } = await supabase
            .from('properties')
            .select('*')
            .eq('available', true)
            .order('created_at', { ascending: false })
          
          if (propertiesError) throw propertiesError
          setProperties(propertiesData)
        } else {
          throw new Error('Missing required parameters')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load required data. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [supabase, requestId, userId, viewingId])
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    
    try {
      // Validate form
      if (!selectedProperty || !viewingDate || !viewingTime) {
        throw new Error('Please fill in all required fields')
      }
      
      const viewingData = {
        property_id: selectedProperty,
        user_id: userId,
        request_id: requestId !== 'null' && requestId !== 'undefined' ? requestId : null,
        viewing_date: viewingDate,
        viewing_time: viewingTime,
        notes,
        private_notes: privateNotes,
        status
      }
      
      // Update existing viewing or create new one
      if (viewingId) {
        const { error: updateError } = await supabase
          .from('scheduled_viewings')
          .update(viewingData)
          .eq('id', viewingId)
        
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('scheduled_viewings')
          .insert([viewingData])
        
        if (insertError) throw insertError
      }
      
      setSuccess(true)
      
      // Create a notification for the user
      await supabase.from('notifications').insert([{
        user_id: userId,
        title: 'Viewing Scheduled',
        message: `A viewing has been ${viewingId ? 'updated' : 'scheduled'} for you. Please check your scheduled viewings.`,
        type: 'viewing_scheduled',
        action_url: '/dashboard/scheduled-viewings',
        entity_id: selectedProperty,
        entity_type: 'property'
      }])
      
      // Redirect after a delay
      setTimeout(() => {
        router.push('/sales-ops/scheduled-viewings')
      }, 2000)
    } catch (error) {
      console.error('Error saving viewing:', error)
      setError(error.message || 'Failed to save viewing. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  return (
    <div>
      <div className="mb-6">
        <Link 
          href="/sales-ops/scheduled-viewings"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <FaArrowLeft className="mr-2 h-4 w-4" />
          Back to Scheduled Viewings
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          {viewingId ? 'Edit Viewing Appointment' : 'Schedule New Viewing'}
        </h1>
      </div>
      
      {success ? (
        <Card className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <FaCheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Viewing {viewingId ? 'Updated' : 'Scheduled'} Successfully</h3>
          <p className="mt-1 text-sm text-gray-500">
            The viewing has been {viewingId ? 'updated' : 'scheduled'} and the customer has been notified.
          </p>
          <div className="mt-6">
            <Button 
              variant="primary"
              onClick={() => router.push('/sales-ops/scheduled-viewings')}
            >
              Go to Scheduled Viewings
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column - Form */}
          <div className="lg:col-span-2">
            <Card>
              <form onSubmit={handleSubmit}>
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Viewing Details</h2>
                  
                  {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                      <div className="flex">
                        <FaTimesCircle className="h-5 w-5 text-red-400 mr-2" />
                        <span>{error}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    {/* Property selection */}
                    <div>
                      <label htmlFor="property" className="block text-sm font-medium text-gray-700 mb-1">
                        Property <span className="text-red-500">*</span>
                      </label>
                      {viewing || property ? (
                        <div className="flex items-center bg-gray-50 p-3 rounded-md">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              className="h-10 w-10 rounded-md object-cover" 
                              src={viewing?.property?.featured_image || property?.featured_image || "https://via.placeholder.com/100?text=No+Image"} 
                              alt="" 
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {viewing?.property?.title || property?.title}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <FaMapMarkerAlt className="mr-1 h-3 w-3" />
                              {viewing?.property?.location || property?.location}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <select
                          id="property"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                          value={selectedProperty}
                          onChange={(e) => setSelectedProperty(e.target.value)}
                          required
                        >
                          <option value="">Select a property</option>
                          {properties.map((property) => (
                            <option key={property.id} value={property.id}>
                              {property.title} - {property.location}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    
                    {/* Information about customer preferences */}
                    {viewing && viewing.preferred_dates && viewing.preferred_times && (
                      <div className="mb-4 bg-yellow-50 p-4 rounded-md">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <FaInfoCircle className="h-5 w-5 text-yellow-400" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">Customer Preferences</h3>
                            <div className="mt-2 text-sm text-yellow-700">
                              <p className="mb-1">
                                <strong>Preferred dates:</strong>{' '}
                                {Array.isArray(viewing.preferred_dates) && viewing.preferred_dates.map(date => formatDate(date)).join(', ')}
                              </p>
                              <p>
                                <strong>Preferred times:</strong>{' '}
                                {Array.isArray(viewing.preferred_times) && viewing.preferred_times.join(', ')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Date and time */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                          Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="date"
                            id="date"
                            className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            min={today}
                            value={viewingDate}
                            onChange={(e) => setViewingDate(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                          Time <span className="text-red-500">*</span>
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaClock className="h-5 w-5 text-gray-400" />
                          </div>
                          <select
                            id="time"
                            className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            value={viewingTime}
                            onChange={(e) => setViewingTime(e.target.value)}
                            required
                          >
                            <option value="">Select a time</option>
                            <option value="09:00">9:00 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="12:00">12:00 PM</option>
                            <option value="13:00">1:00 PM</option>
                            <option value="14:00">2:00 PM</option>
                            <option value="15:00">3:00 PM</option>
                            <option value="16:00">4:00 PM</option>
                            <option value="17:00">5:00 PM</option>
                            <option value="18:00">6:00 PM</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status */}
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        id="status"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    
                    {/* Notes */}
                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                        Customer Notes (Visible to customer)
                      </label>
                      <textarea
                        id="notes"
                        rows={3}
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Instructions for the customer..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      ></textarea>
                    </div>
                    
                    {/* Private Notes */}
                    <div>
                      <label htmlFor="privateNotes" className="block text-sm font-medium text-gray-700 mb-1">
                        Private Notes (Only visible to sales team)
                      </label>
                      <textarea
                        id="privateNotes"
                        rows={3}
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Internal notes about this viewing..."
                        value={privateNotes}
                        onChange={(e) => setPrivateNotes(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-3 bg-gray-50 text-right sm:px-6 border-t border-gray-200">
                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => router.back()}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      leftIcon={<FaSave />}
                      loading={submitting}
                    >
                      {submitting ? 'Saving...' : 'Save Viewing'}
                    </Button>
                  </div>
                </div>
              </form>
            </Card>
          </div>
          
          {/* Right column - Customer Info */}
          <div>
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h2>
                
                {user ? (
                  <div>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <FaUser className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    
                    {user.phone && (
                      <div className="mt-4 text-sm text-gray-500">
                        <div className="font-medium text-gray-700">Phone</div>
                        <div>{user.phone}</div>
                      </div>
                    )}
                    
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/sales-ops/customers/${user.id}`)}
                        >
                          View Profile
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/sales-ops/messages?user=${user.id}`)}
                        >
                          Send Message
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">Customer information not available</p>
                  </div>
                )}
              </div>
            </Card>
            
            {/* Property Request Info */}
            {request && (
              <Card className="mt-6">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Property Request</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-gray-700">Title</div>
                      <div className="mt-1 text-sm text-gray-900">{request.title}</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-gray-700">Property Type</div>
                        <div className="mt-1 text-sm text-gray-900">{request.property_type}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-gray-700">Location</div>
                        <div className="mt-1 text-sm text-gray-900">{request.location}</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-700">Budget</div>
                      <div className="mt-1 text-sm text-gray-900">
                        {request.min_price.toLocaleString()} - {request.max_price.toLocaleString()} EGP
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        onClick={() => router.push(`/sales-ops/requests/${request.id}`)}
                      >
                        View Full Request
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}