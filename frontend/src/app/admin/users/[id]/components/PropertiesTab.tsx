'use client'

import { FaHeart, FaEye, FaMapMarkerAlt, FaBed, FaBath, FaRuler } from 'react-icons/fa'

type PropertiesTabProps = {
  properties: any[]
  formatPrice: (price: number) => string
  noDataMessage?: string
}

export default function PropertiesTab({ properties, formatPrice, noDataMessage = "This user hasn't saved any properties yet" }: PropertiesTabProps) {
  return (
    <div className="bg-white p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Saved Properties</h2>
      
      {properties.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">🏠</div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No saved properties</h3>
          <p className="text-gray-500 text-sm">
            {noDataMessage}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {properties.map((saved) => {
            const property = saved.properties
            return (
              <div
                key={saved.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                {/* Property Image */}
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative">
                  <img
                    src={property.featured_image || "https://via.placeholder.com/800x450?text=No+Image"}
                    alt={property.title}
                    className="w-full h-44 object-cover"
                  />
                  {saved.is_favorite && (
                    <div className="absolute top-2 right-2">
                      <div className="p-1 bg-white rounded-full shadow-sm">
                        <FaHeart className="h-4 w-4 text-red-500" />
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2">
                    <span className="inline-block bg-gray-800 bg-opacity-75 text-white px-2 py-1 text-xs rounded-md">
                      {property.property_type}
                    </span>
                  </div>
                </div>
                
                {/* Property Details */}
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
                      {property.title}
                    </h3>
                    <p className="text-lg font-bold text-primary">
                      {formatPrice(property.price)}
                    </p>
                  </div>
                  
                  <p className="mt-1 text-sm text-gray-500 flex items-center">
                    <FaMapMarkerAlt className="mr-1 text-gray-400" />
                    {property.location}
                  </p>
                  
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    {property.bedrooms && (
                      <div className="flex items-center">
                        <FaBed className="mr-1" />
                        <span>{property.bedrooms} beds</span>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex items-center">
                        <FaBath className="mr-1" />
                        <span>{property.bathrooms} baths</span>
                      </div>
                    )}
                    {property.area_size && (
                      <div className="flex items-center">
                        <FaRuler className="mr-1" />
                        <span>{property.area_size} m²</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 sm:px-6">
                  <a
                    href={`/properties/${property.id}`}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <FaEye className="mr-2 h-4 w-4" />
                    View Property
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
