'use client'

import Link from 'next/link'
import { 
  FaBuilding, 
  FaMapMarkerAlt, 
  FaRuler, 
  FaBed, 
  FaBath, 
  FaCalendarAlt, 
  FaPercentage,
  FaExternalLinkAlt 
} from 'react-icons/fa'

export default function MatchedProperties({ matchedProperties, requestId }) {
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Matched Properties
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Properties that match the customer's requirements
          </p>
        </div>
        <div className="text-sm">
          <span className="font-medium">{matchedProperties.length}</span> matches found
        </div>
      </div>
      <div className="border-t border-gray-200">
        {matchedProperties.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {matchedProperties.map((property) => (
              <li key={property.id} className="px-4 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md overflow-hidden">
                    {property.image_urls && property.image_urls.length > 0 ? (
                      <img 
                        src={property.image_urls[0]} 
                        alt={property.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full">
                        <FaBuilding className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium text-gray-900">{property.title}</h4>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FaPercentage className="mr-1 h-3 w-3" />
                        {property.matchPercentage}% Match
                      </span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <FaMapMarkerAlt className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <span>{property.location}</span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <span className="mr-2 inline-flex items-center">
                        <FaBed className="mr-1 h-4 w-4 text-gray-400" />
                        {property.bedrooms}
                      </span>
                      <span className="mr-2 inline-flex items-center">
                        <FaBath className="mr-1 h-4 w-4 text-gray-400" />
                        {property.bathrooms}
                      </span>
                      <span className="mr-2 inline-flex items-center">
                        <FaRuler className="mr-1 h-4 w-4 text-gray-400" />
                        {property.area_size} m²
                      </span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(property.price)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <Link 
                    href={`/properties/${property.id}`}
                    className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <FaExternalLinkAlt className="mr-1 h-3 w-3" />
                    View Property
                  </Link>
                  <Link 
                    href={`/sales-ops/schedule-viewing?property=${property.id}&request=${requestId}`}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <FaCalendarAlt className="mr-1 h-3 w-3" />
                    Schedule Viewing
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6">
            <FaBuilding className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No matching properties</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are no properties that match this customer's requirements.
            </p>
            <div className="mt-6">
              <Link 
                href="/sales-ops/properties/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Add New Property
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}