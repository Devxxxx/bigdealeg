'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { getPropertyRequests, addStatusUpdate } from '@/lib/api/propertyRequest'
import { toast } from 'react-hot-toast'
import {
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiEye,
  FiExternalLink,
  FiUser,
  FiMapPin,
  FiHome,
  FiDollarSign,
  FiCalendar,
  FiClock,
  FiPhone,
  FiMail,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle, FiClipboard
} from 'react-icons/fi'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'

export default function CustomerRequests() {
  const { session } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [itemsPerPage] = useState(10)
  
  // Filters and sorting
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    location: '',
    property_type: ''
  })
  const [sortField, setSortField] = useState('created_at')
  const [sortDirection, setSortDirection] = useState('desc')
  const [filtersVisible, setFiltersVisible] = useState(false)

  // For status updating
  const [updatingRequestId, setUpdatingRequestId] = useState(null)
  const [expandedRequests, setExpandedRequests] = useState([])

  // Fetch requests based on filters, search, sorting and pagination
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true)
      try {
        if (!session?.access_token) {
          console.error('No access token available')
          return
        }
        
        // Build filters object for API call
        const apiFilters = {
          // Remove userId to get all requests (since we're in sales-ops view)
          searchTerm,
          status: filters.status,
          location: filters.location,
          property_type: filters.property_type,
          sortField,
          sortDirection,
          page: page - 1, // API uses 0-based indexing
          pageSize: itemsPerPage,
          // This tells the backend we want to see all requests, not just our own
          viewAll: true
        }
        
        const result = await getPropertyRequests(session.access_token, apiFilters)
        console.log('Property requests result:', result)
        
        setRequests(result.requests || [])
        setTotalCount(result.totalCount || 0)
      } catch (error) {
        console.error('Error fetching customer requests:', error)
        toast.error('Failed to load property requests')
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [session, searchTerm, filters, sortField, sortDirection, page, itemsPerPage])

  // Handle sort toggle
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  // Handle filter change
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }))
    setPage(1) // Reset to first page when filter changes
  }

  // Update request status
  const updateRequestStatus = async (id, newStatus) => {
    setUpdatingRequestId(id)
    try {
      if (!session?.access_token) {
        throw new Error('No access token available')
      }
      
      // Add status update with API
      const statusData = {
        status: newStatus,
        notes: `Status changed to ${newStatus}`,
        is_private: false
      }
      
      const { request } = await addStatusUpdate(session.access_token, id, statusData)
      
      // Update local state
      setRequests(requests.map(req => 
        req.id === id ? { ...req, status: newStatus } : req
      ))
      
      toast.success(`Request status updated to ${newStatus}`)
    } catch (error) {
      console.error('Error updating request status:', error)
      toast.error('Failed to update request status')
    } finally {
      setUpdatingRequestId(null)
    }
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Format currency range
  const formatPriceRange = (min, max) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0
    })
    
    return `${formatter.format(min)} - ${formatter.format(max)}`
  }

  // Get unique locations for filter dropdown
  const locations = [...new Set(requests.map(request => request.location))].sort()
  
  // Get unique property types for filter dropdown
  const propertyTypes = [...new Set(requests.map(request => request.property_type))].sort()

  // Toggle expanded view for a request
  const toggleExpanded = (id) => {
    setExpandedRequests(prev => 
      prev.includes(id) 
        ? prev.filter(requestId => requestId !== id) 
        : [...prev, id]
    )
  }

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FiCheckCircle className="mr-1 h-3 w-3" />
            Active
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <FiAlertCircle className="mr-1 h-3 w-3" />
            Pending
          </span>
        )
      case 'closed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <FiXCircle className="mr-1 h-3 w-3" />
            Closed
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <FiAlertCircle className="mr-1 h-3 w-3" />
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
          </span>
        )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Requests</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and process property requests from customers
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <Button
            variant="gradient"
            size="sm"
            leftIcon={<FiFilter />}
            onClick={() => setFiltersVisible(!filtersVisible)}
          >
            {filtersVisible ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="w-full sm:w-2/3 relative">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setPage(1) // Reset to first page on search
              }}
              placeholder="Search by title, location, or property type..."
              leftIcon={<FiSearch />}
              rightIcon={searchTerm ? <FiX /> : null}
              clickableRightIcon={true}
              onRightIconClick={() => setSearchTerm('')}
              className="w-full"
            />
          </div>

          <div className="w-full sm:w-auto flex space-x-2 mt-4 sm:mt-0">
            <div className="relative">
              <Button
                variant="light"
                onClick={() => handleSort('created_at')}
                rightIcon={
                  sortField === 'created_at' ? (
                    sortDirection === 'asc' ? <FiChevronDown className="rotate-180"/> : <FiChevronDown />
                  ) : null
                }
                className={sortField === 'created_at' ? 'bg-gray-100' : ''}
                size="sm"
              >
                Date
              </Button>
            </div>

            <div className="relative">
              <Button
                variant="light"
                onClick={() => handleSort('status')}
                rightIcon={
                  sortField === 'status' ? (
                    sortDirection === 'asc' ? <FiChevronDown className="rotate-180"/> : <FiChevronDown />
                  ) : null
                }
                className={sortField === 'status' ? 'bg-gray-100' : ''}
                size="sm"
              >
                Status
              </Button>
            </div>
          </div>
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {filtersVisible && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 mt-4 border-t border-gray-100">
                <div>
                  <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    id="status-filter"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 py-2 px-3 bg-white focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="location-filter" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <select
                    id="location-filter"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 py-2 px-3 bg-white focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">All Locations</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="property-type-filter" className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                  <select
                    id="property-type-filter"
                    value={filters.property_type}
                    onChange={(e) => handleFilterChange('property_type', e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 py-2 px-3 bg-white focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">All Types</option>
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end pt-4 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFilters({
                      status: '',
                      location: '',
                      property_type: ''
                    });
                    setPage(1);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Requests List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative h-16 w-16">
            <div className="absolute top-0 left-0 right-0 bottom-0 border-t-4 border-primary-500 border-solid rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 right-0 bottom-0 border-t-4 border-primary-200 border-solid rounded-full opacity-20"></div>
          </div>
        </div>
      ) : requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((request) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={updatingRequestId === request.id ? 'opacity-75' : ''}
            >
              <Card 
                className="overflow-hidden" 
                padding="none"
                hover={true}
              >
                <div className="p-5">
                  <div className="sm:flex sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">
                          {request.title || `Request #${request.id.substring(0, 8)}`}
                        </h3>
                        {getStatusBadge(request.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 mt-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <FiUser className="text-primary-500 mr-2 flex-shrink-0" />
                          <span>{request.user?.name || 'Unknown User'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FiMapPin className="text-primary-500 mr-2 flex-shrink-0" />
                          <span>{request.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FiHome className="text-primary-500 mr-2 flex-shrink-0" />
                          <span>{request.property_type}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FiDollarSign className="text-primary-500 mr-2 flex-shrink-0" />
                          <span>{formatPriceRange(request.min_price, request.max_price)}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {request.bedrooms} Beds
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {request.bathrooms} Baths
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {request.area_size} m²
                        </span>
                        {request.created_at && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <FiCalendar className="mr-1 h-3 w-3" />
                            {formatDate(request.created_at)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 sm:mt-0 sm:ml-4 flex sm:flex-col sm:items-end">
                      {/* Status Update Dropdown */}
                      <div className="relative">
                        <select
                          disabled={updatingRequestId === request.id}
                          value={request.status}
                          onChange={(e) => updateRequestStatus(request.id, e.target.value)}
                          className="block w-full rounded-lg border border-gray-300 py-2 px-3 bg-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                        >
                          <option value="pending">Set as Pending</option>
                          <option value="active">Set as Active</option>
                          <option value="closed">Set as Closed</option>
                        </select>
                        {updatingRequestId === request.id && (
                          <div className="absolute right-3 top-2.5">
                            <div className="animate-spin h-4 w-4 border-2 border-primary-500 border-t-transparent rounded-full"></div>
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => toggleExpanded(request.id)}
                        className="mt-3 text-primary-600 hover:text-primary-800 text-sm flex items-center"
                      >
                        {expandedRequests.includes(request.id) ? (
                          <>Hide Details <FiChevronDown className="ml-1 rotate-180" /></>
                        ) : (
                          <>View Details <FiChevronDown className="ml-1" /></>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {expandedRequests.includes(request.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-gray-100 overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h4>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <div className="space-y-2">
                                <div className="flex items-center text-sm">
                                  <FiUser className="text-gray-400 mr-2 h-4 w-4" />
                                  <span className="text-gray-600">{request.user?.name || 'N/A'}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <FiMail className="text-gray-400 mr-2 h-4 w-4" />
                                  <span className="text-gray-600">{request.user?.email || 'N/A'}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <FiPhone className="text-gray-400 mr-2 h-4 w-4" />
                                  <span className="text-gray-600">{request.user?.phone || 'N/A'}</span>
                                </div>
                              </div>
                              
                              <div className="mt-3 flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="xs"
                                  leftIcon={<FiMail />}
                                >
                                  Email
                                </Button>
                                <Button
                                  variant="outline"
                                  size="xs"
                                  leftIcon={<FiPhone />}
                                >
                                  Call
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Information</h4>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              {request.additional_features ? (
                                <p className="text-sm text-gray-600 mb-3">{request.additional_features}</p>
                              ) : (
                                <p className="text-sm text-gray-500 italic mb-3">No additional information provided.</p>
                              )}
                              
                              {Object.keys(request.custom_fields || {}).length > 0 && (
                                <div className="space-y-1">
                                  <h5 className="text-xs font-medium text-gray-700">Custom Fields:</h5>
                                  <div className="grid grid-cols-2 gap-1">
                                    {Object.entries(request.custom_fields).map(([key, value]) => (
                                      <div key={key} className="flex items-center text-xs">
                                        <span className="font-medium text-gray-600">{key.replace(/_/g, ' ')}:</span>
                                        <span className="ml-1 text-gray-600">{value.toString()}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <Link
                            href={`/sales-ops/requests/${request.id}`}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <FiExternalLink className="mr-1.5 h-4 w-4" />
                            Full Details
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </motion.div>
          ))}
          
          {/* Pagination */}
          {totalCount > itemsPerPage && (
            <Card className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(page - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(page * itemsPerPage, totalCount)}
                  </span>{' '}
                  of <span className="font-medium">{totalCount}</span> results
                </p>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="light"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                
                {[...Array(Math.min(5, Math.ceil(totalCount / itemsPerPage)))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={i}
                      variant={page === pageNum ? "primary" : "light"}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                <Button
                  variant="light"
                  size="sm"
                  onClick={() => setPage(Math.min(Math.ceil(totalCount / itemsPerPage), page + 1))}
                  disabled={page >= Math.ceil(totalCount / itemsPerPage)}
                >
                  Next
                </Button>
              </div>
            </Card>
          )}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <div className="mx-auto h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <FiClipboard className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No customer requests found</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            {searchTerm || filters.status || filters.location || filters.property_type
              ? 'Try adjusting your search or filters to find what you\'re looking for.'
              : 'Customer requests will appear here once they are submitted.'}
          </p>
        </Card>
      )}
    </motion.div>
  )
}