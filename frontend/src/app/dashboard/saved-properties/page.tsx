'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSavedProperties } from '@/hooks/useSavedProperties'
import { useAuth } from '@/hooks/useAuth'
import {
  FaHeart,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaRuler,
  FaTrash,
  FaEye,
  FaShare,
  FaRegStar,
  FaStar, FaHome, FaBuilding
} from 'react-icons/fa'

// Property type definition
type Property = {
  id: string
  title: string
  description: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  area_size: number
  property_type: string
  images?: string[]
  featured_image?: string
}

export default function SavedProperties() {
  const { user } = useAuth()
  const { 
    savedProperties: savedPropertiesData, 
    loading, 
    fetchSavedProperties,
    toggleSaved,
    unsaveProperty
  } = useSavedProperties()
  const router = useRouter()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('date_saved')
  const [favorites, setFavorites] = useState<string[]>([])
  const [properties, setProperties] = useState<any[]>([])

  // Fetch saved properties on mount
  useEffect(() => {
    // Call the hook method to fetch data
    fetchSavedProperties()
  }, [fetchSavedProperties])
  
  // Process saved properties data when it changes
  useEffect(() => {
    if (savedPropertiesData && savedPropertiesData.length > 0) {
      // Extract favorite properties (placeholder logic - implement your own favorite logic)
      const favoriteIds = savedPropertiesData
        .filter(item => item.is_favorite) // Assuming 'is_favorite' field exists
        .map(item => item.property_id)
      
      setFavorites(favoriteIds)
      
      // Format the properties data for our component
      const formattedProperties = savedPropertiesData.map(item => {
        const property = item.properties
        return {
          id: property.id,
          title: property.title,
          description: property.description,
          price: property.price,
          location: property.location,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          area_size: property.area_size,
          property_type: property.property_type,
          featured_image: property.featured_image,
          date_saved: item.created_at,
          is_favorite: favoriteIds.includes(property.id)
        }
      })
      
      setProperties(formattedProperties)
    } else {
      setProperties([])
    }
  }, [savedPropertiesData])
  
  // Toggle favorite (placeholder - implement your own favorite logic)
  const toggleFavorite = async (propertyId: string) => {
    // Update local state for now
    if (favorites.includes(propertyId)) {
      setFavorites(favorites.filter(id => id !== propertyId))
    } else {
      setFavorites([...favorites, propertyId])
    }
    
    // Update property list
    setProperties(properties.map(property => {
      if (property.id === propertyId) {
        return {
          ...property,
          is_favorite: !property.is_favorite
        }
      }
      return property
    }))
  }
  
  // Remove saved property
  const removeSavedProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to remove this property from your saved list?')) {
      return
    }
    
    try {
      // Call the hook method to unsave the property
      await unsaveProperty(propertyId)
      
      // The properties list will be updated automatically through the hook
    } catch (error) {
      console.error('Error removing saved property:', error)
    }
  }
  
  // Filter and sort properties
  const filteredProperties = properties.filter(property => {
    // Search term
    const matchesSearch = searchTerm === '' || 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.property_type.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Property type
    const matchesType = filterType === 'all' || property.property_type === filterType
    
    return matchesSearch && matchesType
  })
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
      maximumFractionDigits: 0
    }).format(amount)
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaHeart className="mr-3 text-primary" />
            Saved Properties
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            View and manage your saved properties
          </p>
        </div>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Search saved properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative w-full md:w-48">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaFilter className="h-4 w-4 text-gray-400" />
          </div>
          <select
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="apartment">Apartments</option>
            <option value="villa">Villas</option>
            <option value="townhouse">Townhouses</option>
            <option value="office">Offices</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>
        
        <div className="relative w-full md:w-48">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSortAmountDown className="h-4 w-4 text-gray-400" />
          </div>
          <select
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date_saved">Date Saved</option>
            <option value="price_asc">Price (Low to High)</option>
            <option value="price_desc">Price (High to Low)</option>
            <option value="area_desc">Area (Largest First)</option>
          </select>
        </div>
      </div>
      
      {/* Properties Grid */}
      <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Your Saved Properties 
              <span className="ml-2 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                {filteredProperties.length}
              </span>
            </h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <span className="ml-3 text-sm text-gray-500">Loading properties...</span>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <FaBuilding className="mr-2 h-4 w-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No saved properties</h3>
              <p className="text-gray-500 text-sm mb-4">
                {searchTerm || filterType !== 'all' 
                  ? "Try adjusting your search or filter" 
                  : "Browse properties and save them to view them here"}
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
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProperties.map((property) => (
                <div 
                  key={property.id}
                  className="group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  {/* Property Image */}
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative">
                    <img
                      src={property.featured_image || "https://via.placeholder.com/800x450?text=No+Image"}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button
                        onClick={() => toggleFavorite(property.id)}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
                        title={favorites.includes(property.id) ? "Remove from favorites" : "Add to favorites"}
                      >
                        {favorites.includes(property.id) ? (
                          <FaStar className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <FaRegStar className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                      <button
                        onClick={() => removeSavedProperty(property.id)}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
                        title="Remove from saved"
                      >
                        <FaTrash className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <span className="inline-block bg-gray-800 bg-opacity-75 text-white px-2 py-1 text-xs rounded-md">
                        {property.property_type}
                      </span>
                    </div>
                  </div>
                  
                  {/* Property Details */}
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary">
                        {property.title}
                      </h3>
                      <p className="text-lg font-bold text-primary">
                        {formatCurrency(property.price)}
                      </p>
                    </div>
                    
                    <p className="mt-1 text-sm text-gray-500 flex items-center">
                      <FaMapMarkerAlt className="mr-1 text-gray-400" />
                      {property.location}
                    </p>
                    
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaBed className="mr-1" />
                        <span>{property.bedrooms} beds</span>
                      </div>
                      <div className="flex items-center">
                        <FaBath className="mr-1" />
                        <span>{property.bathrooms} baths</span>
                      </div>
                      <div className="flex items-center">
                        <FaRuler className="mr-1" />
                        <span>{property.area_size} m²</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 sm:px-6 flex justify-between">
                    <a
                      href={`/properties/${property.id}`}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      <FaEye className="mr-2 h-4 w-4" />
                      View Details
                    </a>
                    <button
                      className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      <FaShare className="mr-2 h-4 w-4" />
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
