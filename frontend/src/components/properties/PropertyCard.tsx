'use client'

import Link from 'next/link'
import { FaBuilding, FaBed, FaBath, FaRuler, FaPercentage, FaCalendarAlt, FaChevronRight } from 'react-icons/fa'

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    location: string;
    price: number;
    bedrooms: string | number;
    bathrooms: string | number;
    area_size: string | number;
    image_url?: string;
    matchPercentage?: number;
    property_type: string;
  };
  onScheduleClick?: (id: string) => void;
  showMatchPercentage?: boolean;
}

export default function PropertyCard({ property, onScheduleClick, showMatchPercentage = false }: PropertyCardProps) {
  return (
    <div className="bg-white overflow-hidden rounded-xl border border-gray-200 shadow-card hover-lift group transition-all">
      <div className="relative h-52 overflow-hidden">
        {showMatchPercentage && property.matchPercentage && (
          <div className="absolute top-2 left-2 z-10">
            <span className="badge-success flex items-center shadow-sm">
              <FaPercentage className="mr-1 h-3 w-3" />
              {property.matchPercentage}% Match
            </span>
          </div>
        )}

        <div className="absolute top-2 right-2 z-10">
          <span className="badge bg-gray-900 bg-opacity-60 text-white px-2 py-1 text-xs rounded-md shadow-sm">
            {property.property_type}
          </span>
        </div>

        {property.image_url ? (
          <img 
            src={property.image_url} 
            alt={property.title} 
            className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
            <div className="text-center">
              <FaBuilding className="mx-auto h-12 w-12 text-primary-400" />
              <p className="mt-2 text-sm text-primary-600 font-medium">No image available</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-display text-lg font-semibold text-gray-900 leading-tight line-clamp-1 group-hover:text-primary-700 transition-colors">
              {property.title}
            </h3>
            <p className="mt-1 text-sm text-gray-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="line-clamp-1">{property.location}</span>
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xl font-display font-semibold text-primary-700">
            {property.price.toLocaleString()} <span className="text-sm font-normal text-gray-600">EGP</span>
          </p>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="grid grid-cols-3 gap-2 w-full">
            <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-lg">
              <FaBed className="text-gray-500 mb-1 h-4 w-4" />
              <span className="text-xs text-gray-700 font-medium">{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-lg">
              <FaBath className="text-gray-500 mb-1 h-4 w-4" />
              <span className="text-xs text-gray-700 font-medium">{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-lg">
              <FaRuler className="text-gray-500 mb-1 h-4 w-4" />
              <span className="text-xs text-gray-700 font-medium">{property.area_size} m²</span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex space-x-2">
          <Link
            href={`/properties/${property.id}`}
            className="btn-outline flex-1 text-center text-sm py-2 flex items-center justify-center"
          >
            View Details
            <FaChevronRight className="ml-2 h-3 w-3" />
          </Link>
          {onScheduleClick && (
            <button
              onClick={() => onScheduleClick(property.id)}
              className="btn-primary flex-1 text-sm py-2 flex items-center justify-center"
            >
              <FaCalendarAlt className="mr-2 h-3 w-3" />
              Schedule
            </button>
          )}
        </div>
      </div>
    </div>
  )
}