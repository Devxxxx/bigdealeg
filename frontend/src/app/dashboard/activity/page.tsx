'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { 
  FaHistory, 
  FaEye, 
  FaHeart, 
  FaComment, 
  FaCalendarAlt, 
  FaClipboardList,
  FaFilter,
  FaSearch
} from 'react-icons/fa'
import {FiCalendar} from "react-icons/fi";

// Activity types
type ActivityType = 'view' | 'save' | 'favorite' | 'message' | 'request' | 'viewing' | 'all'

// Activity item
type ActivityItem = {
  id: string
  user_id: string
  activity_type: ActivityType
  property_id?: string
  property_title?: string
  property_location?: string
  details?: string
  created_at: string
}

export default function ActivityHistory() {
  const { supabase } = useSupabase()
  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [filterType, setFilterType] = useState<ActivityType>('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Fetch activity history
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true)
        
        // Get user ID
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          throw new Error('User not authenticated')
        }
        
        // Fetch user activities
        const { data, error } = await supabase
          .from('user_activity')
          .select(`
            id,
            user_id,
            activity_type,
            property_id,
            details,
            created_at,
            properties:property_id (
              title,
              location
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(100)
        
        if (error) throw error
        
        // Format activities
        const formattedActivities = data.map((item: { id: any; user_id: any; activity_type: any; property_id: any; properties: { title: any; location: any; }; details: any; created_at: any; }) => ({
          id: item.id,
          user_id: item.user_id,
          activity_type: item.activity_type,
          property_id: item.property_id,
          property_title: item.properties?.title,
          property_location: item.properties?.location,
          details: item.details,
          created_at: item.created_at
        }))
        
        setActivities(formattedActivities)
      } catch (error) {
        console.error('Error fetching activity history:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchActivities()
  }, [supabase])
  
  // Filter activities
  const filteredActivities = activities.filter(activity => {
    // Activity type filter
    const matchesType = filterType === 'all' || activity.activity_type === filterType
    
    // Search term filter (property title or location)
    const matchesSearch = searchTerm === '' || 
      (activity.property_title && activity.property_title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (activity.property_location && activity.property_location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (activity.details && activity.details.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesType && matchesSearch
  })
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
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
  
  // Get activity icon
  const getActivityIcon = (type: ActivityType) => {
    switch(type) {
      case 'view':
        return <FaEye className="h-5 w-5 text-blue-500" />
      case 'save':
        return <FaClipboardList className="h-5 w-5 text-green-500" />
      case 'favorite':
        return <FaHeart className="h-5 w-5 text-red-500" />
      case 'message':
        return <FaComment className="h-5 w-5 text-purple-500" />
      case 'request':
        return <FaClipboardList className="h-5 w-5 text-orange-500" />
      case 'viewing':
        return <FaCalendarAlt className="h-5 w-5 text-teal-500" />
      default:
        return <FaHistory className="h-5 w-5 text-gray-500" />
    }
  }
  
  // Get activity description
  const getActivityDescription = (activity: ActivityItem) => {
    switch(activity.activity_type) {
      case 'view':
        return `You viewed a property: ${activity.property_title}`
      case 'save':
        return `You saved a property: ${activity.property_title}`
      case 'favorite':
        return `You favorited a property: ${activity.property_title}`
      case 'message':
        return `You sent a message regarding: ${activity.property_title}`
      case 'request':
        return `You submitted a property request ${activity.details ? ': ' + activity.details : ''}`
      case 'viewing':
        return `You scheduled a viewing for: ${activity.property_title}`
      default:
        return `Activity on property: ${activity.property_title}`
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FiCalendar className="h-10 w-10 text-primary-500" />
            Activity History
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Track your recent activities and interactions
          </p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative w-full md:w-56">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaFilter className="h-4 w-4 text-gray-400" />
          </div>
          <select
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as ActivityType)}
          >
            <option value="all">All Activities</option>
            <option value="view">Property Views</option>
            <option value="save">Saved Properties</option>
            <option value="favorite">Favorited Properties</option>
            <option value="message">Messages</option>
            <option value="request">Property Requests</option>
            <option value="viewing">Scheduled Viewings</option>
          </select>
        </div>
      </div>
      
      {/* Activity Timeline */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Your Recent Activities
              <span className="ml-2 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                {filteredActivities.length}
              </span>
            </h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <span className="ml-3 text-sm text-gray-500">Loading activities...</span>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <FiCalendar className="h-10 w-10 text-primary-500" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No activities found</h3>
              <p className="text-gray-500 text-sm mb-4">
                {searchTerm || filterType !== 'all' 
                  ? "Try adjusting your search or filter" 
                  : "Your activity history will appear here as you interact with properties"}
              </p>
              <a 
                href="/properties"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <FaSearch className="mr-2 h-4 w-4" />
                Browse Properties
              </a>
            </div>
          ) : (
            <div className="mt-6 flow-root">
              <ul className="-mb-8">
                {filteredActivities.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== filteredActivities.length - 1 ? (
                        <span
                          className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex items-start space-x-3">
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                            {getActivityIcon(activity.activity_type)}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div>
                            <div className="text-sm">
                              <p className="font-medium text-gray-900">
                                {getActivityDescription(activity)}
                              </p>
                            </div>
                            <div className="mt-1 text-sm text-gray-500">
                              <div className="flex items-center">
                                <time dateTime={activity.created_at}>
                                  {formatDate(activity.created_at)} at {formatTime(activity.created_at)}
                                </time>
                              </div>
                            </div>
                            {activity.property_location && (
                              <div className="mt-1 text-sm text-gray-500">
                                <span>Location: {activity.property_location}</span>
                              </div>
                            )}
                          </div>
                          
                          {activity.property_id && (
                            <div className="mt-2">
                              <a
                                href={`/properties/${activity.property_id}`}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                              >
                                <FaEye className="mr-1 h-3 w-3" />
                                View Property
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
