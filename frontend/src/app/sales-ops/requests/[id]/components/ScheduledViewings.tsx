'use client'

import Link from 'next/link'
import { 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaBuilding, 
  FaCheckCircle, 
  FaTimesCircle,
  FaExclamationCircle
} from 'react-icons/fa'

export default function ScheduledViewings({ viewings, loadingViewings, formatDate, requestId, userId }) {
  if (loadingViewings) {
    return (
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Scheduled Viewings
          </h3>
          <div className="mt-4 flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Scheduled Viewings
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Property viewings for this customer
          </p>
        </div>
        <Link 
          href={`/sales-ops/schedule-viewing?request=${requestId}&user=${userId}`}
          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <FaCalendarAlt className="mr-1 h-3 w-3" />
          Schedule Viewing
        </Link>
      </div>
      <div className="border-t border-gray-200">
        {viewings.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {viewings.map((viewing) => (
              <li key={viewing.id} className="px-4 py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <FaBuilding className="h-5 w-5 text-gray-400" />
                      <span className="ml-1 text-sm font-medium text-gray-900">
                        {viewing.property?.title || 'Unknown Property'}
                      </span>
                      <span 
                        className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${viewing.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          viewing.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                          viewing.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'}`}
                      >
                        {viewing.status === 'confirmed' && <FaCheckCircle className="mr-1 h-3 w-3" />}
                        {viewing.status === 'cancelled' && <FaTimesCircle className="mr-1 h-3 w-3" />}
                        {viewing.status === 'pending' && <FaExclamationCircle className="mr-1 h-3 w-3" />}
                        {viewing.status.charAt(0).toUpperCase() + viewing.status.slice(1)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <FaMapMarkerAlt className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <p>{viewing.property?.location || 'Unknown Location'}</p>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaCalendarAlt className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <p>{viewing.viewing_date ? formatDate(viewing.viewing_date) : 'Date TBD'}</p>
                      </div>
                      <div className="flex items-center">
                        <FaClock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <p>{viewing.viewing_time || 'Time TBD'}</p>
                      </div>
                    </div>
                    {viewing.notes && (
                      <div className="mt-2 text-sm text-gray-500">
                        <p className="font-medium">Notes:</p>
                        <p>{viewing.notes}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Link 
                      href={`/sales-ops/viewings/${viewing.id}`}
                      className="text-sm text-primary hover:text-primary-dark"
                    >
                      View details →
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6">
            <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No viewings scheduled</h3>
            <p className="mt-1 text-sm text-gray-500">
              This customer hasn't scheduled any property viewings yet.
            </p>
            <div className="mt-6">
              <Link 
                href={`/sales-ops/schedule-viewing?request=${requestId}&user=${userId}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <FaCalendarAlt className="mr-2 -ml-1 h-5 w-5" />
                Schedule Viewing
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}