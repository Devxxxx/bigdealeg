'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { usePropertyRequests } from '@/hooks/usePropertyRequests'
import { 
  FiEdit, 
  FiCalendar,
  FiArrowLeft, 
  FiChevronRight,
  FiHome,
  FiMapPin,
  FiDollarSign,
  FiMaximize2,
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
  FiEye,
  FiRepeat,
  FiInfo,
  FiClock,
  FiPercent,
  FiClipboard
} from 'react-icons/fi'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'

export default function PropertyRequestDetail({ params }) {
  const { id } = params
  const { user } = useAuth()
  const router = useRouter()
  const { 
    currentRequest: request, 
    loading, 
    fetchRequestById
  } = usePropertyRequests()
  const [matchedProperties, setMatchedProperties] = useState([])
  const [activeTab, setActiveTab] = useState('details') // 'details', 'matches', 'history'

  useEffect(() => {
    if (id) {
      fetchRequestById(id);
    }
  }, [id, fetchRequestById]);

  useEffect(() => {
    // When we have the request, process the matched properties
    if (request && request.property_matches) {
      // Sort by match percentage
      const sortedMatches = [...request.property_matches]
        .filter(match => match.properties) // Ensure we have property data
        .sort((a, b) => b.match_score - a.match_score)
        .map(match => ({
          ...match.properties,
          matchPercentage: match.match_score
        }));
      
      setMatchedProperties(sortedMatches);
    }
  }, [request]);

  const handleScheduleViewing = async (propertyId) => {
    router.push(`/dashboard/schedule-viewing/${propertyId}?request_id=${id}`)
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Get status badge component
  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <FiAlertCircle className="mr-1 h-3 w-3" />
            Pending
          </span>
        );
      case 'active':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FiCheckCircle className="mr-1 h-3 w-3" />
            Active
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <FiXCircle className="mr-1 h-3 w-3" />
            Closed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <FiInfo className="mr-1 h-3 w-3" />
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="relative h-10 w-10">
          <div className="absolute top-0 left-0 right-0 bottom-0 border-t-3 border-primary-500 border-solid rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 right-0 bottom-0 border-t-3 border-primary-200 border-solid rounded-full opacity-20"></div>
        </div>
      </div>
    )
  }

  if (!request) {
    return (
      <Card className="py-6 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-primary-50 flex items-center justify-center mb-3">
          <FiInfo className="h-6 w-6 text-primary-500" />
        </div>
        <h3 className="text-sm font-medium text-gray-900 mb-1">Request not found</h3>
        <p className="text-xs text-gray-500 max-w-md mx-auto mb-4">
          The property request you're looking for doesn't exist or you don't have access to it.
        </p>
        <Button
          variant="primary"
          href="/dashboard/property-requests"
          leftIcon={<FiArrowLeft />}
          size="sm"
        >
          Back to Requests
        </Button>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
        <div>
          <Link
            href="/dashboard/property-requests"
            className="inline-flex items-center text-xs text-gray-500 hover:text-primary mb-1"
          >
            <FiArrowLeft className="mr-1 h-3 w-3" />
            Back to requests
          </Link>
          <h1 className="text-xl font-bold text-gray-900">
            {request.title || `Request #${request.id.substring(0, 8)}`}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            {getStatusBadge(request.status)}
            <span className="text-xs text-gray-500">
              Created {formatDate(request.created_at)}
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          href={`/dashboard/property-requests/${id}/edit`}
          leftIcon={<FiEdit />}
          size="sm"
        >
          Edit
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-3">
        <button
          onClick={() => setActiveTab('details')}
          className={`flex items-center px-3 py-2 text-xs font-medium -mb-px ${
            activeTab === 'details'
              ? 'text-primary-600 border-b-2 border-primary-500'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
          }`}
        >
          <FiClipboard className="mr-1.5 h-3.5 w-3.5" />
          Request Details
        </button>
        <button
          onClick={() => setActiveTab('matches')}
          className={`flex items-center px-3 py-2 text-xs font-medium -mb-px ${
            activeTab === 'matches'
              ? 'text-primary-600 border-b-2 border-primary-500'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
          }`}
        >
          <FiPercent className="mr-1.5 h-3.5 w-3.5" />
          Matches {matchedProperties.length > 0 && `(${matchedProperties.length})`}
        </button>
        {request.status_history && request.status_history.length > 0 && (
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center px-3 py-2 text-xs font-medium -mb-px ${
              activeTab === 'history'
                ? 'text-primary-600 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
            }`}
          >
            <FiClock className="mr-1.5 h-3.5 w-3.5" />
            History
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* Details Tab */}
        {activeTab === 'details' && (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4">
                <div>
                  <div className="flex items-center mb-1">
                    <FiHome className="text-primary-500 mr-1 h-3.5 w-3.5" />
                    <span className="text-xs font-medium text-gray-500">Property Type</span>
                  </div>
                  <p className="text-sm font-medium">{request.property_type}</p>
                </div>
                
                <div>
                  <div className="flex items-center mb-1">
                    <FiMapPin className="text-primary-500 mr-1 h-3.5 w-3.5" />
                    <span className="text-xs font-medium text-gray-500">Location</span>
                  </div>
                  <p className="text-sm font-medium">{request.location}</p>
                </div>
                
                <div className="col-span-2">
                  <div className="flex items-center mb-1">
                    <FiDollarSign className="text-primary-500 mr-1 h-3.5 w-3.5" />
                    <span className="text-xs font-medium text-gray-500">Price Range</span>
                  </div>
                  <p className="text-sm font-medium">
                    {request.min_price?.toLocaleString()} - {request.max_price?.toLocaleString()} EGP
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center mb-1">
                    <FiRepeat className="text-primary-500 mr-1 h-3.5 w-3.5" />
                    <span className="text-xs font-medium text-gray-500">Bedrooms</span>
                  </div>
                  <p className="text-sm font-medium">{request.bedrooms}</p>
                </div>
                
                <div>
                  <div className="flex items-center mb-1">
                    <FiRepeat className="text-primary-500 mr-1 h-3.5 w-3.5" />
                    <span className="text-xs font-medium text-gray-500">Bathrooms</span>
                  </div>
                  <p className="text-sm font-medium">{request.bathrooms}</p>
                </div>
                
                <div>
                  <div className="flex items-center mb-1">
                    <FiMaximize2 className="text-primary-500 mr-1 h-3.5 w-3.5" />
                    <span className="text-xs font-medium text-gray-500">Area Size</span>
                  </div>
                  <p className="text-sm font-medium">{request.area_size} m²</p>
                </div>
                
                {request.custom_fields && Object.keys(request.custom_fields).length > 0 && (
                  <div className="col-span-2 sm:col-span-4 border-t border-gray-100 pt-3 mt-1">
                    <div className="flex items-center mb-2">
                      <span className="text-xs font-medium text-gray-500">Additional Features</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {Object.entries(request.custom_fields).map(([key, value]) => (
                        <div key={key} className="flex items-center">
                          {typeof value === 'boolean' ? (
                            <span className={`inline-flex items-center text-xs ${value ? 'text-green-600' : 'text-gray-400'}`}>
                              {value ? <FiCheckCircle className="mr-1 h-3 w-3" /> : <FiXCircle className="mr-1 h-3 w-3" />}
                              {key.replace(/_/g, ' ')}
                            </span>
                          ) : (
                            <span className="text-xs">
                              <span className="font-medium">{key.replace(/_/g, ' ')}:</span> {value.toString()}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {request.additional_features && (
                  <div className="col-span-2 sm:col-span-4 border-t border-gray-100 pt-3 mt-1">
                    <div className="flex items-center mb-1">
                      <span className="text-xs font-medium text-gray-500">Additional Requirements</span>
                    </div>
                    <p className="text-sm text-gray-600">{request.additional_features}</p>
                  </div>
                )}
              </div>
              
              {/* Matches Summary if we have matching properties */}
              {matchedProperties.length > 0 && (
                <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-medium text-gray-600">
                      {matchedProperties.length} matching {matchedProperties.length === 1 ? 'property' : 'properties'} found
                    </span>
                  </div>
                  <Button
                    variant="light"
                    size="xs"
                    rightIcon={<FiChevronRight />}
                    onClick={() => setActiveTab('matches')}
                  >
                    View Matches
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {/* Matches Tab */}
        {activeTab === 'matches' && (
          <motion.div
            key="matches"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {matchedProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {matchedProperties.map((property) => (
                  <Card 
                    key={property.id} 
                    padding="none"
                    hover={true}
                    className="overflow-hidden"
                  >
                    <div className="relative h-32 bg-gray-100">
                      {property.featured_image ? (
                        <img 
                          src={property.featured_image} 
                          alt={property.title} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full bg-gray-100">
                          <FiHome className="h-8 w-8 text-gray-300" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded shadow">
                        {property.matchPercentage}% Match
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-gray-900 mb-1">{property.title}</h3>
                      <div className="flex items-center text-xs text-gray-500 mb-1.5">
                        <FiMapPin className="h-3 w-3 text-gray-400 mr-1" />
                        {property.location}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-primary-600">{property.price?.toLocaleString()} EGP</p>
                        <div className="flex items-center text-xs text-gray-500">
                          {property.bedrooms && <span className="mr-2">{property.bedrooms} Beds</span>}
                          {property.bathrooms && <span className="mr-2">{property.bathrooms} Baths</span>}
                          <span>{property.area_size} m²</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-1 mt-3">
                        <Button
                          variant="outline"
                          leftIcon={<FiEye />}
                          size="xs"
                          href={`/properties/${property.id}`}
                          className="flex-1"
                        >
                          View
                        </Button>
                        <Button
                          variant="primary"
                          leftIcon={<FiCalendar />}
                          size="xs"
                          onClick={() => handleScheduleViewing(property.id)}
                          className="flex-1"
                        >
                          Schedule
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="py-4 text-center">
                <div className="mx-auto h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <FiInfo className="h-5 w-5 text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">No matching properties</h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto mb-3">
                  We couldn't find any properties matching your requirements.
                </p>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Try adjusting your requirements or check back later.
                </p>
              </Card>
            )}
          </motion.div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && request.status_history && request.status_history.length > 0 && (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <div className="divide-y divide-gray-100">
                {request.status_history.map((statusUpdate) => (
                  <div key={statusUpdate.id} className="px-3 py-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                          {statusUpdate.new_status === 'active' && (
                            <FiCheckCircle className="h-4 w-4 text-green-500" />
                          )}
                          {statusUpdate.new_status === 'pending' && (
                            <FiAlertCircle className="h-4 w-4 text-amber-500" />
                          )}
                          {statusUpdate.new_status === 'closed' && (
                            <FiXCircle className="h-4 w-4 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-900">
                            Status changed to <span className="font-bold">{statusUpdate.new_status}</span>
                            {statusUpdate.old_status && (
                              <span className="text-gray-500"> from {statusUpdate.old_status}</span>
                            )}
                          </p>
                          {statusUpdate.notes && (
                            <p className="text-xs text-gray-500 mt-0.5">{statusUpdate.notes}</p>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 ml-2">
                        {formatDate(statusUpdate.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}