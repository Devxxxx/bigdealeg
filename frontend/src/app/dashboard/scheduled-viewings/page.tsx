'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useScheduledViewings } from '@/hooks/useScheduledViewings'
import { useAuth } from '@/hooks/useAuth'
import { 
  FiCalendar, 
  FiMapPin, 
  FiHome, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiAlertCircle,
  FiInfo,
  FiChevronDown,
  FiChevronUp,
  FiExternalLink,
  FiPhone,
  FiMail,
  FiUser,
  FiLoader
} from 'react-icons/fi'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import SelectViewingSlotModal from '@/components/properties/SelectViewingSlotModal'
import CancelViewingModal from '@/components/viewings/CancelViewingModal'

export default function ScheduledViewings() {
  const [activeFilter, setActiveFilter] = useState('all') // 'all', 'upcoming', 'past'
  const [expandedViewings, setExpandedViewings] = useState([])
  const [selectSlotModalOpen, setSelectSlotModalOpen] = useState(false)
  const [viewingToSelect, setViewingToSelect] = useState(null)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [viewingToCancel, setViewingToCancel] = useState(null)
  const { isAuthenticated, loading: authLoading } = useAuth()
  
  // Use our hook to fetch and manage scheduled viewings
  const { 
    groupedViewings, 
    loading, 
    error, 
    cancelViewing,
    hasInitiallyLoaded 
  } = useScheduledViewings({
    filter: activeFilter
  })

  // Toggle expanded view for a viewing
  const toggleExpanded = (id) => {
    setExpandedViewings(prev => 
      prev.includes(id) 
        ? prev.filter(viewingId => viewingId !== id) 
        : [...prev, id]
    )
  }
  
  // Open the select slot modal
  const openSelectSlotModal = (viewing) => {
    setViewingToSelect(viewing)
    setSelectSlotModalOpen(true)
  }
  
  // Open the cancel modal
  const openCancelModal = (viewing) => {
    setViewingToCancel(viewing)
    setCancelModalOpen(true)
  }
  
  // Handle successful cancellation
  const handleCancelSuccess = () => {
    // The hook will handle updating the state
    setCancelModalOpen(false)
    setViewingToCancel(null)
  }

  // Handle successful slot selection
  const handleSelectSuccess = () => {
    // The hook will handle updating the state
    setSelectSlotModalOpen(false)
    setViewingToSelect(null)
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FiCheckCircle className="mr-1 h-3 w-3" />
            Confirmed
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <FiXCircle className="mr-1 h-3 w-3" />
            Cancelled
          </span>
        )
      case 'requested':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <FiAlertCircle className="mr-1 h-3 w-3" />
            Requested
          </span>
        )
      case 'options_sent':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <FiInfo className="mr-1 h-3 w-3" />
            Select Time
          </span>
        )
      case 'slot_selected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <FiClock className="mr-1 h-3 w-3" />
            Time Selected
          </span>
        )
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <FiCheckCircle className="mr-1 h-3 w-3" />
            Completed
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <FiInfo className="mr-1 h-3 w-3" />
            {status || 'Unknown'}
          </span>
        )
    }
  }

  // Determine if a date is in the past
  const isPastDate = (dateString) => {
    if (!dateString) return false;
    
    const viewingDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return viewingDate < today;
  }
  
  // Show loading indicator while authentication is still being determined
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative h-16 w-16 flex items-center justify-center">
          <FiLoader className="animate-spin text-primary-500 h-10 w-10" />
          <p className="mt-16 text-sm text-gray-500">Loading authentication...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated, show login message
  if (!isAuthenticated && hasInitiallyLoaded) {
    return (
      <div className="opacity-100 transition-opacity duration-500">
        <Card className="py-12 text-center">
          <div className="mx-auto h-20 w-20 rounded-full bg-primary-50 flex items-center justify-center mb-4">
            <FiUser className="h-10 w-10 text-primary-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Authentication Required</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            You need to be logged in to view your scheduled property viewings.
          </p>
          <Button
            variant="gradient"
            href="/login"
          >
            Log In
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="opacity-100 transition-opacity duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scheduled Viewings</h1>
          <p className="text-gray-600 mt-1">Manage your property viewing appointments</p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={activeFilter === 'all' ? 'primary' : 'light'}
            size="sm"
            onClick={() => setActiveFilter('all')}
            disabled={loading}
          >
            All
          </Button>
          <Button
            variant={activeFilter === 'upcoming' ? 'primary' : 'light'}
            size="sm"
            onClick={() => setActiveFilter('upcoming')}
            disabled={loading}
          >
            Upcoming
          </Button>
          <Button
            variant={activeFilter === 'past' ? 'primary' : 'light'}
            size="sm"
            onClick={() => setActiveFilter('past')}
            disabled={loading}
          >
            Past
          </Button>
        </div>
      </div>

      {loading && !hasInitiallyLoaded ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative h-16 w-16 flex items-center justify-center">
            <FiLoader className="animate-spin text-primary-500 h-10 w-10" />
            <p className="mt-16 text-sm text-gray-500">Loading your scheduled viewings...</p>
          </div>
        </div>
      ) : error ? (
        <Card className="py-8 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <FiAlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Unable to load viewings</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            {error}
          </p>
          <Button
            variant="primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </Card>
      ) : Object.entries(groupedViewings).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedViewings).map(([dateGroup, viewings]) => (
            <div
              key={dateGroup}
              className="opacity-100 transform translate-y-0 transition-all duration-300"
            >
              <h2 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <FiCalendar className="mr-2 text-primary-500" />
                {dateGroup}
                {dateGroup === 'Today' && (
                  <span className="ml-2 text-xs font-medium py-0.5 px-2 rounded-full bg-blue-100 text-blue-700">
                    Today
                  </span>
                )}
                {dateGroup === 'Tomorrow' && (
                  <span className="ml-2 text-xs font-medium py-0.5 px-2 rounded-full bg-purple-100 text-purple-700">
                    Tomorrow
                  </span>
                )}
                {dateGroup === 'Pending Confirmation' && (
                  <span className="ml-2 text-xs font-medium py-0.5 px-2 rounded-full bg-yellow-100 text-yellow-700">
                    Awaiting Confirmation
                  </span>
                )}
              </h2>
              
              <div className="grid grid-cols-1 gap-4">
                {viewings.map((viewing) => (
                  <Card 
                    key={viewing.id} 
                    className={`overflow-hidden transition-all duration-300 
                      ${isPastDate(viewing.viewing_date) ? 'bg-gray-50' : 'bg-white'} 
                      ${viewing.status === 'cancelled' ? 'border-red-200' : ''}`}
                    padding="none"
                    hover={true}
                  >
                    <div className="p-5">
                      <div className="flex flex-col sm:flex-row justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 mr-3">
                              {viewing.property?.title || 'Property Viewing'}
                            </h3>
                            {getStatusBadge(viewing.status)}
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 mb-3">
                            <div className="flex items-center text-gray-600">
                              <FiMapPin className="text-primary-500 mr-2 flex-shrink-0" />
                              <span>{viewing.property?.location || 'Location unavailable'}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <FiClock className="text-primary-500 mr-2 flex-shrink-0" />
                              <span>{viewing.viewing_time || 'Time not set'}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <FiHome className="text-primary-500 mr-2 flex-shrink-0" />
                              <span>{viewing.property?.property_type || 'Property type unavailable'}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <FiUser className="text-primary-500 mr-2 flex-shrink-0" />
                              <span>Sales Agent Assigned</span>
                            </div>
                          </div>
                          
                          {viewing.status === 'cancelled' && (
                            <div className="bg-red-50 text-red-800 p-2 rounded-md text-sm mt-2">
                              This viewing has been cancelled. Please contact our team for assistance.
                            </div>
                          )}
                          
                          {viewing.status === 'confirmed' && !isPastDate(viewing.viewing_date) && (
                            <div className="bg-green-50 text-green-800 p-2 rounded-md text-sm mt-2">
                              Your viewing is confirmed. We look forward to meeting you!
                            </div>
                          )}
                          
                          {viewing.status === 'requested' && (
                            <div className="bg-gray-50 text-gray-800 p-2 rounded-md text-sm mt-2">
                              Thank you for requesting this viewing. Our sales team will propose available time slots soon.
                            </div>
                          )}
                          
                          {viewing.status === 'options_sent' && (
                            <div className="bg-blue-50 text-blue-800 p-2 rounded-md text-sm mt-2">
                              <p>Our sales team has proposed available time slots. Please select your preferred time.</p>
                              <button
                                onClick={() => openSelectSlotModal(viewing)}
                                className="mt-1 text-blue-700 hover:text-blue-900 font-medium text-sm"
                              >
                                Select a time slot
                              </button>
                            </div>
                          )}
                          
                          {viewing.status === 'slot_selected' && (
                            <div className="bg-purple-50 text-purple-800 p-2 rounded-md text-sm mt-2">
                              <p>Thank you for selecting your preferred time slot. Our sales team will confirm your appointment shortly.</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4 sm:mt-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-start">
                          <div className="flex items-center bg-primary-50 text-primary-700 px-2 py-1 rounded-full text-sm font-medium">
                            <FiCalendar className="mr-1" />
                            {viewing.viewing_date ? formatDate(viewing.viewing_date) : 'Date pending'}
                          </div>
                          
                          <button
                            onClick={() => toggleExpanded(viewing.id)}
                            className="ml-4 sm:ml-0 sm:mt-3 text-primary-600 hover:text-primary-800 text-sm flex items-center"
                          >
                            {expandedViewings.includes(viewing.id) ? (
                              <>
                                <FiChevronUp className="mr-1" />
                                Hide Details
                              </>
                            ) : (
                              <>
                                <FiChevronDown className="mr-1" />
                                Show Details
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                      
                      {expandedViewings.includes(viewing.id) && (
                        <div
                          className="mt-4 overflow-hidden"
                        >
                          <div className="border-t border-gray-100 pt-4">
                            {viewing.notes && (
                              <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-1">Notes</h4>
                                <p className="text-sm text-gray-600">{viewing.notes}</p>
                              </div>
                            )}
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-1">Property Details</h4>
                                <div className="bg-gray-50 p-3 rounded-md">
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="text-gray-600">Type:</div>
                                    <div className="font-medium">{viewing.property?.property_type || 'N/A'}</div>
                                    
                                    <div className="text-gray-600">Bedrooms:</div>
                                    <div className="font-medium">{viewing.property?.bedrooms || 'N/A'}</div>
                                    
                                    <div className="text-gray-600">Bathrooms:</div>
                                    <div className="font-medium">{viewing.property?.bathrooms || 'N/A'}</div>
                                    
                                    <div className="text-gray-600">Area:</div>
                                    <div className="font-medium">{viewing.property?.area_size ? `${viewing.property.area_size} m²` : 'N/A'}</div>
                                    
                                    <div className="text-gray-600">Price:</div>
                                    <div className="font-medium">{viewing.property?.price ? `${viewing.property.price.toLocaleString()} EGP` : 'N/A'}</div>
                                  </div>
                                  
                                  <div className="mt-3">
                                    <Link
                                      href={`/properties/${viewing.property?.id}`}
                                      className="inline-flex items-center text-primary-600 hover:text-primary-800 text-sm"
                                    >
                                      View Property Listing
                                      <FiExternalLink className="ml-1 h-3 w-3" />
                                    </Link>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-1">Contact Information</h4>
                                <div className="bg-gray-50 p-3 rounded-md">
                                  <div className="flex flex-col space-y-2 text-sm">
                                    <div className="flex items-center text-gray-600">
                                      <FiPhone className="h-4 w-4 mr-2" />
                                      <span>Sales Team: +20 123 456 7890</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                      <FiMail className="h-4 w-4 mr-2" />
                                      <span>viewings@bigdealegy.com</span>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-3 grid grid-cols-2 gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      leftIcon={<FiPhone />}
                                      disabled={viewing.status === 'cancelled'}
                                      className="w-full"
                                    >
                                      Call
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      leftIcon={<FiCalendar />}
                                      disabled={viewing.status === 'cancelled'}
                                      className="w-full"
                                    >
                                      Reschedule
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {viewing.status === 'options_sent' && viewing.proposed_dates && viewing.proposed_times && (
                              <div className="mt-4 bg-blue-50 p-3 rounded-md">
                                <h4 className="text-sm font-medium text-blue-800 mb-1">Available Time Slots</h4>
                                <div className="text-sm text-blue-700">
                                  <p className="mb-1">
                                    <span className="font-medium">Available dates:</span>{' '}
                                    {Array.isArray(viewing.proposed_dates) && viewing.proposed_dates.map(date => 
                                      new Date(date).toLocaleDateString()
                                    ).join(', ')}
                                  </p>
                                  <p className="mb-3">
                                    <span className="font-medium">Available times:</span>{' '}
                                    {Array.isArray(viewing.proposed_times) && viewing.proposed_times.join(', ')}
                                  </p>
                                  <button
                                    onClick={() => openSelectSlotModal(viewing)}
                                    className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
                                  >
                                    Select Time Slot
                                  </button>
                                </div>
                              </div>
                            )}
                            
                            {viewing.status === 'slot_selected' && viewing.selected_date && viewing.selected_time && (
                              <div className="mt-4 bg-purple-50 p-3 rounded-md">
                                <h4 className="text-sm font-medium text-purple-800 mb-1">Your Selected Time</h4>
                                <div className="text-sm text-purple-700">
                                  <p className="mb-1">
                                    <span className="font-medium">Selected date:</span>{' '}
                                    {new Date(viewing.selected_date).toLocaleDateString()}
                                  </p>
                                  <p>
                                    <span className="font-medium">Selected time:</span>{' '}
                                    {viewing.selected_time}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between">
                      <div className="flex items-center">
                        <div 
                          className={`h-2 w-2 rounded-full mr-2 ${
                            viewing.status === 'confirmed' ? 'bg-green-500' :
                            viewing.status === 'pending' ? 'bg-amber-500' :
                            viewing.status === 'cancelled' ? 'bg-red-500' :
                            'bg-gray-500'
                          }`}
                        ></div>
                        <span className="text-sm text-gray-600">
                          {viewing.status === 'confirmed' ? 'Confirmed' :
                           viewing.status === 'requested' ? 'Request Submitted' :
                           viewing.status === 'options_sent' ? 'Select Available Time' :
                           viewing.status === 'slot_selected' ? 'Awaiting Confirmation' :
                           viewing.status === 'cancelled' ? 'Cancelled' :
                           viewing.status === 'completed' ? 'Completed' : 'Unknown Status'}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Link
                          href={`/dashboard/scheduled-viewings/${viewing.id}`}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors"
                        >
                          View Details
                        </Link>
                        {viewing.status === 'options_sent' && (
                          <button
                            onClick={() => openSelectSlotModal(viewing)}
                            className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                          >
                            Select Time
                          </button>
                        )}
                        {(viewing.status === 'requested' || viewing.status === 'options_sent') && (
                          <button
                            onClick={() => openCancelModal(viewing)}
                            className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="opacity-100 scale-100 transition-all duration-300"
        >
          <Card className="py-12 text-center">
            <div className="mx-auto h-20 w-20 rounded-full bg-primary-50 flex items-center justify-center mb-4">
              <FiCalendar className="h-10 w-10 text-primary-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No viewings scheduled</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              You don't have any {activeFilter !== 'all' ? activeFilter : ''} property viewings scheduled.
            </p>
            <Button
              variant="gradient"
              href="/dashboard/property-requests"
              leftIcon={<FiHome />}
            >
              Browse Property Requests
            </Button>
          </Card>
        </div>
      )}
      
      {/* Cancel Viewing Modal */}
      <CancelViewingModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        viewingId={viewingToCancel?.id}
        onSuccess={handleCancelSuccess}
      />
      
      {/* Select Viewing Slot Modal */}
      {viewingToSelect && (
        <SelectViewingSlotModal
          isOpen={selectSlotModalOpen}
          onClose={() => setSelectSlotModalOpen(false)}
          viewingId={viewingToSelect.id}
          propertyTitle={viewingToSelect.property?.title || 'Property'}
          proposedDates={viewingToSelect.proposed_dates || []}
          proposedTimes={viewingToSelect.proposed_times || []}
        />
      )}
    </div>
  )
}