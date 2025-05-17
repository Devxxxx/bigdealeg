'use client'

import { FaCheckCircle, FaHourglass, FaTimesCircle, FaMapMarkerAlt, FaBed, FaBath, FaRuler, FaMoneyBillWave } from 'react-icons/fa'

type RequestsTabProps = {
  requests: any[]
  formatPrice: (price: number) => string
  formatDate: (dateString?: string) => string
  noDataMessage?: string
}

export default function RequestsTab({ requests, formatPrice, formatDate, noDataMessage = "This user hasn't submitted any property requests yet" }: RequestsTabProps) {
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FaHourglass className="mr-1 h-3 w-3" />
            Pending
          </span>
        )
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FaCheckCircle className="mr-1 h-3 w-3" />
            Active
          </span>
        )
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <FaCheckCircle className="mr-1 h-3 w-3" />
            Completed
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <FaTimesCircle className="mr-1 h-3 w-3" />
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
  
  return (
    <div className="bg-white p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Property Requests</h2>
      
      {requests.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No property requests</h3>
          <p className="text-gray-500 text-sm">
            {noDataMessage}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm p-6"
            >
              <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {request.title || `Property Request #${request.id.slice(0, 8)}`}
                  </h3>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <FaMapMarkerAlt className="mr-1 h-4 w-4 text-gray-400" />
                    {request.location}
                  </div>
                </div>
                <div className="mt-4 sm:mt-0">
                  {getStatusBadge(request.status)}
                </div>
              </div>
              
              <div className="mt-6 border-t border-gray-200 pt-4">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <FaMoneyBillWave className="mr-1 h-4 w-4 text-gray-400" />
                      Price Range
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatPrice(request.min_price)} - {formatPrice(request.max_price)}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <FaBed className="mr-1 h-4 w-4 text-gray-400" />
                      Bedrooms
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {request.bedrooms}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <FaBath className="mr-1 h-4 w-4 text-gray-400" />
                      Bathrooms
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {request.bathrooms}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <FaRuler className="mr-1 h-4 w-4 text-gray-400" />
                      Area Size
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {request.area_size} m²
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Property Type
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {request.property_type}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Submitted On
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatDate(request.created_at)}
                    </dd>
                  </div>
                </dl>
              </div>
              
              <div className="mt-6 flex justify-end">
                <a
                  href={`/sales-ops/requests/${request.id}`}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
