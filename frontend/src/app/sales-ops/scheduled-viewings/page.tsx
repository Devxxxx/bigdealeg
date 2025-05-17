'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getScheduledViewings, updateScheduledViewing, confirmScheduledViewing, completeScheduledViewing, cancelScheduledViewing } from '@/lib/api/scheduledViewing'
import { toast } from 'react-hot-toast'
import {
  FaCalendarAlt,
  FaSearch,
  FaFilter,
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaHome,
  FaCheck,
  FaTimes,
  FaClock,
  FaEdit,
  FaCalendarCheck,
  FaCalendarTimes, FaEye,
} from 'react-icons/fa'
import Link from "next/link";
import ProposeViewingSlotsModal from '@/components/properties/ProposeViewingSlotsModal'

// Viewing type definition
type Viewing = {
  id: string
  property_id: string
  user_id: string
  status: 'requested' | 'options_sent' | 'slot_selected' | 'confirmed' | 'completed' | 'cancelled'
  viewing_date: string
  notes?: string
  proposed_dates?: string[]
  proposed_times?: string[]
  selected_date?: string
  selected_time?: string
  property: {
    id: string
    title: string
    location: string
    featured_image?: string
  }
  profile: {
    id: string
    name: string
    email: string
    phone?: string
  }
}

export default function ScheduledViewings() {
  const { session } = useAuth()
  const [viewings, setViewings] = useState<Viewing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDate, setFilterDate] = useState('all')
  const [selectedViewing, setSelectedViewing] = useState<Viewing | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isProposeModalOpen, setIsProposeModalOpen] = useState(false)
  
  // Fetch viewings data
  useEffect(() => {
    const fetchViewings = async () => {
      try {
        setLoading(true)
        
        if (!session?.access_token) {
          console.error('No access token available')
          return
        }
        
        // Get viewings from backend API with viewAll flag to see all viewings
        const response = await getScheduledViewings(session.access_token, {
          viewAll: true,  // This indicates we want to see all viewings, not just for the current user
          sortBy: 'viewing_date',
          sortDirection: 'asc'
        })
        
        console.log('Scheduled viewings response:', response)
        setViewings(response.viewings || [])
      } catch (error) {
        console.error('Error fetching viewings:', error)
        toast.error('Failed to load scheduled viewings')
      } finally {
        setLoading(false)
      }
    }
    
    fetchViewings()
  }, [session])
  
  // Open viewing details modal
  const openViewingModal = (viewing: Viewing) => {
    setSelectedViewing(viewing)
    setIsModalOpen(true)
  }
  
  // Open propose time slots modal
  const openProposeModal = (viewing: Viewing) => {
    setSelectedViewing(viewing)
    setIsProposeModalOpen(true)
  }
  
  // Update viewing status
  const updateViewingStatus = async (id: string, status: 'requested' | 'options_sent' | 'slot_selected' | 'confirmed' | 'completed' | 'cancelled') => {
    try {
      if (!session?.access_token) {
        throw new Error('No access token available')
      }
      
      let response;
      
      // Use the appropriate API method based on the status
      if (status === 'confirmed') {
        response = await confirmScheduledViewing(session.access_token, id, {})
      } else if (status === 'completed') {
        response = await completeScheduledViewing(session.access_token, id)
      } else if (status === 'cancelled') {
        response = await cancelScheduledViewing(session.access_token, id)
      } else {
        // For any other status, use the generic update method
        response = await updateScheduledViewing(session.access_token, id, { status })
      }
      
      // Update local state
      setViewings(viewings.map(view => {
        if (view.id === id) {
          return { ...view, status }
        }
        return view
      }))
      
      // Close modal if open
      if (selectedViewing?.id === id) {
        setSelectedViewing({ ...selectedViewing, status })
      }
      
      toast.success(`Viewing status updated to ${status}`)
    } catch (error) {
      console.error('Error updating viewing status:', error)
      toast.error('Failed to update viewing status')
    }
  }
  
  // Filter viewings
  const getFilteredViewings = () => {
    return viewings.filter(viewing => {
      // Filter by status
      if (filterStatus !== 'all' && viewing.status !== filterStatus) {
        return false
      }
      
      // Filter by date
      if (filterDate !== 'all') {
        const today = new Date()
        const viewingDate = new Date(viewing.viewing_date)
        
        if (filterDate === 'today') {
          if (viewingDate.toDateString() !== today.toDateString()) {
            return false
          }
        } else if (filterDate === 'upcoming') {
          if (viewingDate < today) {
            return false
          }
        } else if (filterDate === 'past') {
          if (viewingDate > today) {
            return false
          }
        }
      }
      
      // Search by property title, location, or user name
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        return (
          viewing.property.title.toLowerCase().includes(searchLower) ||
          viewing.property.location.toLowerCase().includes(searchLower) ||
          viewing.profile.name.toLowerCase().includes(searchLower)
        )
      }
      
      return true
    })
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }
  
  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'requested':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <FaClock className="mr-1 h-3 w-3" />
            Requested
          </span>
        )
      case 'options_sent':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <FaClock className="mr-1 h-3 w-3" />
            Options Sent
          </span>
        )
      case 'slot_selected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <FaClock className="mr-1 h-3 w-3" />
            Slot Selected
          </span>
        )
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FaCheck className="mr-1 h-3 w-3" />
            Confirmed
          </span>
        )
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <FaCalendarCheck className="mr-1 h-3 w-3" />
            Completed
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <FaCalendarTimes className="mr-1 h-3 w-3" />
            Cancelled
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        )
    }
  }
  
  // Check if date is today
  const isToday = (dateString: string) => {
    const today = new Date()
    const date = new Date(dateString)
    return date.toDateString() === today.toDateString()
  }
  
  // Check if date is in the past
  const isPast = (dateString: string) => {
    const today = new Date()
    const date = new Date(dateString)
    return date < today
  }
  
  const filteredViewings = getFilteredViewings()
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FaCalendarAlt className="mr-3 text-primary" />
              Scheduled Viewings
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage and track property viewing appointments
            </p>
          </div>
          <div>
            <Link
              href="/sales-ops/schedule-viewing"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <FaCalendarAlt className="mr-2 -ml-1 h-4 w-4" />
              New Viewing
            </Link>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Search property, location, or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative w-full md:w-48">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="h-4 w-4 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="requested">Requested</option>
                <option value="options_sent">Options Sent</option>
                <option value="slot_selected">Slot Selected</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className="relative w-full md:w-48">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCalendarAlt className="h-4 w-4 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Viewings List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredViewings.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="text-gray-400 text-4xl mb-4">🗓️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No viewings found</h3>
            <p className="text-gray-500 text-sm">
              {searchTerm || filterStatus !== 'all' || filterDate !== 'all'
                ? "Try adjusting your search or filters"
                : "No property viewings have been scheduled yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredViewings.map((viewing) => (
                  <tr 
                    key={viewing.id} 
                    className={`hover:bg-gray-50 ${isToday(viewing.viewing_date) ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                    <img 
                    className="h-10 w-10 rounded-md object-cover" 
                    src={viewing.property?.featured_image || "https://via.placeholder.com/100?text=No+Image"} 
                    alt="" 
                    />
                    </div>
                    <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                    {viewing.property?.title || 'Unnamed Property'}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                    <FaMapMarkerAlt className="mr-1 h-3 w-3" />
                    {viewing.property?.location || 'No location'}
                    </div>
                    </div>
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                    {viewing.profile?.name || 'Unknown User'}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                    <FaEnvelope className="mr-1 h-3 w-3" />
                    {viewing.profile?.email || 'No email'}
                    </div>
                    {viewing.profile?.phone && (
                    <div className="text-sm text-gray-500 flex items-center">
                    <FaPhone className="mr-1 h-3 w-3" />
                    {viewing.profile.phone}
                    </div>
                    )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(viewing.viewing_date)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTime(viewing.viewing_date)}
                      </div>
                      {isToday(viewing.viewing_date) && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Today
                        </span>
                      )}
                      {isPast(viewing.viewing_date) && !isToday(viewing.viewing_date) && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Past
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(viewing.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openViewingModal(viewing)}
                        className="text-primary hover:text-primary/80 mr-2"
                        title="View Details"
                      >
                        <FaEye className="h-5 w-5" />
                      </button>
                      {viewing.status === 'requested' && (
                        <button
                          onClick={() => openProposeModal(viewing)}
                          className="text-blue-600 hover:text-blue-900 mr-2"
                          title="Propose Times"
                        >
                          <FaClock className="h-5 w-5" />
                        </button>
                      )}
                      {viewing.status === 'slot_selected' && (
                        <button
                          onClick={() => updateViewingStatus(viewing.id, 'confirmed')}
                          className="text-green-600 hover:text-green-900 mr-2"
                          title="Confirm Viewing"
                        >
                          <FaCheck className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => viewing.status === 'confirmed' ? updateViewingStatus(viewing.id, 'completed') : null}
                        className={`${viewing.status === 'confirmed' ? 'text-blue-600 hover:text-blue-900' : 'text-gray-300'} mr-2`}
                        disabled={viewing.status !== 'confirmed'}
                        title="Mark Completed"
                      >
                        <FaCalendarCheck className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => ['requested', 'options_sent', 'slot_selected', 'confirmed'].includes(viewing.status) ? updateViewingStatus(viewing.id, 'cancelled') : null}
                        className={`${['requested', 'options_sent', 'slot_selected', 'confirmed'].includes(viewing.status) ? 'text-red-600 hover:text-red-900' : 'text-gray-300'}`}
                        disabled={!['requested', 'options_sent', 'slot_selected', 'confirmed'].includes(viewing.status)}
                        title="Cancel Viewing"
                      >
                        <FaTimes className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Viewing Details Modal */}
      {isModalOpen && selectedViewing && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setIsModalOpen(false)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* Modal panel */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Viewing Details
                    </h3>
                    
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <h4 className="text-md font-medium text-gray-900">Property Information</h4>
                      <div className="mt-2 flex items-center">
                        <div className="flex-shrink-0 h-14 w-14">
                          <img 
                            className="h-14 w-14 rounded-md object-cover" 
                            src={selectedViewing.property?.featured_image || "https://via.placeholder.com/100?text=No+Image"} 
                            alt="" 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {selectedViewing.property?.title || 'Unnamed Property'}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FaMapMarkerAlt className="mr-1 h-3 w-3" />
                            {selectedViewing.property?.location || 'No location'}
                          </div>
                          <div className="mt-1">
                            <a
                              href={`/properties/${selectedViewing.property_id}`}
                              className="text-xs text-primary hover:text-primary/80"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Property
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <h4 className="text-md font-medium text-gray-900">Customer Information</h4>
                      <div className="mt-2">
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          <FaUser className="mr-2 h-4 w-4 text-gray-400" />
                          {selectedViewing.profile?.name || 'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <FaEnvelope className="mr-2 h-4 w-4 text-gray-400" />
                          {selectedViewing.profile?.email || 'No email'}
                        </div>
                        {selectedViewing.profile?.phone && (
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <FaPhone className="mr-2 h-4 w-4 text-gray-400" />
                            {selectedViewing.profile.phone}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <h4 className="text-md font-medium text-gray-900">Appointment Details</h4>
                      <div className="mt-2 grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-medium text-gray-500">Date</div>
                          <div className="text-sm text-gray-900">{formatDate(selectedViewing.viewing_date)}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-500">Time</div>
                          <div className="text-sm text-gray-900">{formatTime(selectedViewing.viewing_date)}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-500">Status</div>
                          <div className="text-sm text-gray-900">{getStatusBadge(selectedViewing.status)}</div>
                        </div>
                      </div>
                      
                      {/* Show selected or proposed slots if available */}
                      {selectedViewing.status === 'options_sent' && selectedViewing.proposed_dates && selectedViewing.proposed_times && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-md">
                          <h5 className="text-sm font-medium text-blue-800 mb-2">Proposed Times</h5>
                          <div className="text-sm text-blue-700">
                            <p className="mb-1">
                              <span className="font-medium">Dates:</span>{' '}
                              {Array.isArray(selectedViewing.proposed_dates) && selectedViewing.proposed_dates.map(date => 
                                new Date(date).toLocaleDateString()
                              ).join(', ')}
                            </p>
                            <p>
                              <span className="font-medium">Times:</span>{' '}
                              {Array.isArray(selectedViewing.proposed_times) && selectedViewing.proposed_times.join(', ')}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {selectedViewing.status === 'slot_selected' && selectedViewing.selected_date && selectedViewing.selected_time && (
                        <div className="mt-4 p-3 bg-purple-50 rounded-md">
                          <h5 className="text-sm font-medium text-purple-800 mb-2">Selected Time</h5>
                          <div className="text-sm text-purple-700">
                            <p className="mb-1">
                              <span className="font-medium">Date:</span>{' '}
                              {new Date(selectedViewing.selected_date).toLocaleDateString()}
                            </p>
                            <p>
                              <span className="font-medium">Time:</span>{' '}
                              {selectedViewing.selected_time}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {selectedViewing.notes && (
                        <div className="mt-4">
                          <div className="text-sm font-medium text-gray-500">Notes</div>
                          <div className="text-sm text-gray-900 mt-1 bg-gray-50 p-2 rounded">
                            {selectedViewing.notes}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
                
                {selectedViewing.status === 'requested' && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false)
                      openProposeModal(selectedViewing)
                    }}
                    className="ml-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    <FaClock className="mr-2 h-4 w-4" />
                    Propose Times
                  </button>
                )}
                
                {selectedViewing.status === 'slot_selected' && (
                  <button
                    type="button"
                    onClick={() => {
                      updateViewingStatus(selectedViewing.id, 'confirmed')
                      setIsModalOpen(false)
                    }}
                    className="ml-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    <FaCheck className="mr-2 h-4 w-4" />
                    Confirm Viewing
                  </button>
                )}
                
                {selectedViewing.status === 'confirmed' && (
                  <button
                    type="button"
                    onClick={() => {
                      updateViewingStatus(selectedViewing.id, 'completed')
                      setIsModalOpen(false)
                    }}
                    className="ml-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    <FaCalendarCheck className="mr-2 h-4 w-4" />
                    Mark Completed
                  </button>
                )}
                
                {['requested', 'options_sent', 'slot_selected', 'confirmed'].includes(selectedViewing.status) && (
                  <button
                    type="button"
                    onClick={() => {
                      updateViewingStatus(selectedViewing.id, 'cancelled')
                      setIsModalOpen(false)
                    }}
                    className="ml-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    <FaTimes className="mr-2 h-4 w-4" />
                    Cancel Viewing
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Propose Viewing Slots Modal */}
      {selectedViewing && (
        <ProposeViewingSlotsModal
          isOpen={isProposeModalOpen}
          onClose={() => setIsProposeModalOpen(false)}
          viewingId={selectedViewing.id}
          propertyTitle={selectedViewing.property?.title || 'Property'}
        />
      )}
    </div>
  )
}
