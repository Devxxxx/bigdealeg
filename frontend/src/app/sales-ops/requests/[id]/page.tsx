'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { getPropertyRequestById, updatePropertyRequestStatus } from '@/lib/api/salesOps'
import { getProperties } from '@/lib/api/property'
import { getScheduledViewings } from '@/lib/api/scheduledViewing'
import { 
  FaArrowLeft, 
  FaUser, 
  FaPhone, 
  FaEnvelope,
  FaMapMarkerAlt,
  FaBuilding,
  FaEdit,
  FaSave,
  FaTimesCircle,
  FaCheckCircle
} from 'react-icons/fa'

// Import components
import RequestDetails from './components/RequestDetails'
import MatchedProperties from './components/MatchedProperties'
import RequestStatusHistory from './components/RequestStatusHistory'
import StatusUpdateForm from './components/StatusUpdateForm'
import CustomerInfo from './components/CustomerInfo'
import ScheduledViewings from './components/ScheduledViewings'

export default function RequestDetail({ params }) {
  const { id } = params
  const { user, session } = useAuth()
  const router = useRouter()

  // State
  const [request, setRequest] = useState(null)
  const [matchedProperties, setMatchedProperties] = useState([])
  const [statusHistory, setStatusHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState(null)
  
  // Status update state
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [statusNote, setStatusNote] = useState('')
  const [isPrivateNote, setIsPrivateNote] = useState(false)
  const [updateError, setUpdateError] = useState('')
  
  // Scheduled viewings state
  const [viewings, setViewings] = useState([])
  const [loadingViewings, setLoadingViewings] = useState(true)

  // Fetch request data
  useEffect(() => {
    const fetchRequestData = async () => {
      if (!session?.access_token) {
        console.log('No access token available, please log in');
        return;
      }
      
      setLoading(true)
      try {
        // Fetch property request
        const requestData = await getPropertyRequestById(session.access_token, id);
        setRequest(requestData.request);
        setNewStatus(requestData.request.status);

        // Fetch status history
        const statusHistoryResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/sales-ops/property-requests/${id}/status-history`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!statusHistoryResponse.ok) {
          console.error('Error fetching status history:', await statusHistoryResponse.json());
          setStatusHistory([]);
        } else {
          const historyData = await statusHistoryResponse.json();
          setStatusHistory(historyData.statusHistory || []);
        }

        // Fetch matched properties
        const matchedPropertiesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/sales-ops/property-requests/${id}/matched-properties`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!matchedPropertiesResponse.ok) {
          console.error('Error fetching matched properties:', await matchedPropertiesResponse.json());
          setMatchedProperties([]);
        } else {
          const propertiesData = await matchedPropertiesResponse.json();
          setMatchedProperties(propertiesData.properties || []);
        }

        // Fetch user info
        const userInfoResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/sales-ops/users/${requestData.request.user_id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!userInfoResponse.ok) {
          console.error('Error fetching user data:', await userInfoResponse.json());
          setUserInfo(null);
        } else {
          const userData = await userInfoResponse.json();
          setUserInfo(userData.user || null);
        }

        // Fetch scheduled viewings
        const viewingsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/sales-ops/scheduled-viewings?userId=${requestData.request.user_id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!viewingsResponse.ok) {
          console.error('Error fetching scheduled viewings:', await viewingsResponse.json());
          setViewings([]);
        } else {
          const viewingsData = await viewingsResponse.json();
          setViewings(viewingsData.viewings || []);
        }

        setLoadingViewings(false)
      } catch (error) {
        console.error('Error fetching request data:', error)
        router.push('/sales-ops/requests')
      } finally {
        setLoading(false)
      }
    }

    fetchRequestData()
  }, [id, router, session])

  // Handle status update
  const handleStatusUpdate = async (e) => {
    e.preventDefault()
    setIsUpdatingStatus(true)
    setUpdateError('')
    
    try {
      // Use the backend API to update status
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/sales-ops/property-requests/${id}/status-update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus,
          notes: statusNote,
          isPrivate: isPrivateNote
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update status');
      }

      const data = await response.json();
      
      // Update local state
      setRequest({ ...request, status: newStatus });
      
      // Refresh status history
      const historyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/sales-ops/property-requests/${id}/status-history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        setStatusHistory(historyData.statusHistory || []);
      }
      
      // Reset form
      setStatusNote('')
      setIsPrivateNote(false)
      setIsUpdatingStatus(false)
    } catch (error) {
      console.error('Error updating status:', error)
      setUpdateError('Failed to update status: ' + error.message)
      setIsUpdatingStatus(false)
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <FaTimesCircle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Request not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The property request you're looking for doesn't exist or you don't have access to it.
        </p>
        <div className="mt-6">
          <Link 
            href="/sales-ops/requests"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <FaArrowLeft className="mr-2 -ml-1 h-5 w-5" />
            Back to Requests
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <Link 
          href="/sales-ops/requests"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <FaArrowLeft className="mr-2 h-4 w-4" />
          Back to Requests
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Request Details</h1>
        <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                request.status === 'active' ? 'bg-green-100 text-green-800' : 
                'bg-gray-100 text-gray-800'}`}
            >
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </span>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            Created on {formatDate(request.created_at)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column - Request Details and Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Details */}
          <RequestDetails request={request} />

          {/* Status Update */}
          <StatusUpdateForm 
            request={request}
            newStatus={newStatus}
            setNewStatus={setNewStatus}
            statusNote={statusNote}
            setStatusNote={setStatusNote}
            isPrivateNote={isPrivateNote}
            setIsPrivateNote={setIsPrivateNote}
            handleStatusUpdate={handleStatusUpdate}
            isUpdatingStatus={isUpdatingStatus}
            updateError={updateError}
          />

          {/* Status History */}
          <RequestStatusHistory statusHistory={statusHistory} formatDate={formatDate} />

          {/* Matched Properties */}
          <MatchedProperties 
            matchedProperties={matchedProperties} 
            requestId={id} 
          />
        </div>

        {/* Right column - Customer Info and Viewings */}
        <div className="space-y-6">
          {/* Customer Info */}
          <CustomerInfo user={userInfo} />

          {/* Scheduled Viewings */}
          <ScheduledViewings 
            viewings={viewings} 
            loadingViewings={loadingViewings} 
            formatDate={formatDate}
            requestId={id}
            userId={userInfo?.id}
          />
        </div>
      </div>
    </div>
  )
}