'use client'

import { FaEye, FaHome, FaHeart, FaCommentAlt, FaLock, FaHistory } from 'react-icons/fa'

type ActivityTabProps = {
  activity: any[]
  formatDate: (dateString?: string) => string
  noDataMessage?: string
}

export default function ActivityTab({ activity, formatDate, noDataMessage = "This user has no recorded activity" }: ActivityTabProps) {
  // Get activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'view':
        return <FaEye className="h-5 w-5 text-blue-500" />
      case 'save':
        return <FaHome className="h-5 w-5 text-green-500" />
      case 'favorite':
        return <FaHeart className="h-5 w-5 text-red-500" />
      case 'message':
        return <FaCommentAlt className="h-5 w-5 text-purple-500" />
      case 'login':
        return <FaLock className="h-5 w-5 text-green-500" />
      default:
        return <FaHistory className="h-5 w-5 text-gray-500" />
    }
  }
  
  // Get activity description
  const getActivityDescription = (activity: any) => {
    switch (activity.activity_type) {
      case 'view':
        return 'Viewed a property'
      case 'save':
        return 'Saved a property'
      case 'favorite':
        return 'Favorited a property'
      case 'message':
        return 'Sent a message'
      case 'login':
        return 'Logged in'
      case 'request':
        return 'Submitted a property request'
      case 'viewing':
        return 'Scheduled a property viewing'
      default:
        return activity.description || 'Performed an action'
    }
  }
  
  return (
    <div className="bg-white p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Recent Activity</h2>
      
      {activity.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No activity yet</h3>
          <p className="text-gray-500 text-sm">
            {noDataMessage}
          </p>
        </div>
      ) : (
        <div className="flow-root">
          <ul className="-mb-8">
            {activity.map((item, index) => (
              <li key={item.id}>
                <div className="relative pb-8">
                  {index !== activity.length - 1 ? (
                    <span
                      className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex items-start space-x-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                        {getActivityIcon(item.activity_type)}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-900">
                            {getActivityDescription(item)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.details || (item.property_id ? `Property ID: ${item.property_id}` : '')}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {formatDate(item.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
