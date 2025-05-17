'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
  FaEdit,
  FaEye,
  FaTrash,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaRuler,
  FaToggleOn,
  FaToggleOff, 
  FaBuilding,
  FaSpinner
} from 'react-icons/fa'
import salesOpsApi from '@/lib/api/salesOps'

export default function PropertiesManagement() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { session } = useAuth()
  
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [itemsPerPage] = useState(10)
  
  // Filters and sorting
  const [filters, setFilters] = useState({
    location: '',
    property_type: '',
    min_price: '',
    max_price: '',
    available: searchParams.get('available') || ''
  })
  const [sortField, setSortField] = useState('created_at')
  const [sortDirection, setSortDirection] = useState('desc')
  const [filtersVisible, setFiltersVisible] = useState(false)
  const [locations, setLocations] = useState([])
  const [actionInProgress, setActionInProgress] = useState(false)

  // Fetch properties based on filters, search, sorting and pagination
  useEffect(() => {
    const fetchProperties = async () => {
      if (!session?.access_token) {
        return;
      }
      
      setLoading(true)
      try {
        // Create options object for API call
        const options = {
          search: searchTerm,
          location: filters.location,
          property_type: filters.property_type,
          min_price: filters.min_price,
          max_price: filters.max_price,
          available: filters.available,
          sortField,
          sortDirection,
          page,
          limit: itemsPerPage
        };

        // Use the new API client
        const result = await salesOpsApi.getProperties(session.access_token, options);
        
        setProperties(result.properties || []);
        setTotalCount(result.count || 0);
        
        // Extract unique locations for filter dropdown
        if (result.properties && result.properties.length > 0) {
          const uniqueLocations = [...new Set(result.properties.map(property => property.location))].sort();
          setLocations(uniqueLocations);
        }
      } catch (error) {
        console.error('Error fetching properties:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [session?.access_token, searchTerm, filters, sortField, sortDirection, page, itemsPerPage])

  // Handle sort toggle
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
    setPage(1) // Reset to first page when filter changes
  }

  // Handle availability toggle
  const handleAvailabilityToggle = async (id, currentAvailability) => {
    if (!session?.access_token) {
      return;
    }
    
    setActionInProgress(true);
    try {
      const result = await salesOpsApi.togglePropertyAvailability(
        session.access_token, 
        id, 
        currentAvailability
      );

      // Update local state
      setProperties(properties.map(property => 
        property.id === id ? { ...property, available: !currentAvailability } : property
      ));
    } catch (error) {
      console.error('Error updating property availability:', error)
    } finally {
      setActionInProgress(false);
    }
  }

  // Handle property deletion
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    if (!session?.access_token) {
      return;
    }
    
    setActionInProgress(true);
    try {
      await salesOpsApi.deleteProperty(session.access_token, id);

      // Update local state
      setProperties(properties.filter(property => property.id !== id));
      setTotalCount(totalCount - 1);
    } catch (error) {
      console.error('Error deleting property:', error)
    } finally {
      setActionInProgress(false);
    }
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (!session?.access_token) {
    return (
      <div className="bg-white text-center py-10 px-6 shadow sm:rounded-lg">
        <h3 className="mt-2 text-sm font-medium text-gray-900">Authentication Required</h3>
        <p className="mt-1 text-sm text-gray-500">
          You need to be logged in to manage properties.
        </p>
        <div className="mt-6">
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add, edit, and manage property listings.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link 
            href="/sales-ops/properties/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <FaPlus className="mr-2 -ml-1 h-5 w-5" />
            Add Property
          </Link>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-3 md:space-y-0 mb-4">
          <div className="w-full md:w-1/3 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setPage(1) // Reset to first page on search
              }}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Search properties..."
            />
          </div>

          <div className="w-full md:w-auto flex space-x-2">
            <button 
              onClick={() => setFiltersVisible(!filtersVisible)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <FaFilter className="mr-2 h-4 w-4" />
              {filtersVisible ? 'Hide Filters' : 'Show Filters'}
            </button>

            <div>
              <button
                onClick={() => handleSort('price')}
                className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                  sortField === 'price' ? 'bg-gray-100' : ''
                }`}
              >
                Price
                {sortField === 'price' && (
                  sortDirection === 'asc' ? 
                  <FaSortAmountUp className="ml-1 h-4 w-4 text-gray-500" /> : 
                  <FaSortAmountDown className="ml-1 h-4 w-4 text-gray-500" />
                )}
              </button>
            </div>

            <div>
              <button
                onClick={() => handleSort('created_at')}
                className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                  sortField === 'created_at' ? 'bg-gray-100' : ''
                }`}
              >
                Date Added
                {sortField === 'created_at' && (
                  sortDirection === 'asc' ? 
                  <FaSortAmountUp className="ml-1 h-4 w-4 text-gray-500" /> : 
                  <FaSortAmountDown className="ml-1 h-4 w-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {filtersVisible && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <select
                id="location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="property_type" className="block text-sm font-medium text-gray-700">
                Property Type
              </label>
              <select
                id="property_type"
                name="property_type"
                value={filters.property_type}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              >
                <option value="">All Types</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Chalet">Chalet</option>
                <option value="Duplex">Duplex</option>
                <option value="Office">Office</option>
                <option value="Shop">Shop</option>
                <option value="Land">Land</option>
              </select>
            </div>

            <div>
              <label htmlFor="price_range" className="block text-sm font-medium text-gray-700">
                Price Range (EGP)
              </label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <input
                  type="number"
                  name="min_price"
                  placeholder="Min"
                  value={filters.min_price}
                  onChange={handleFilterChange}
                  className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                />
                <input
                  type="number"
                  name="max_price"
                  placeholder="Max"
                  value={filters.max_price}
                  onChange={handleFilterChange}
                  className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                />
              </div>
            </div>

            <div>
              <label htmlFor="available" className="block text-sm font-medium text-gray-700">
                Availability
              </label>
              <select
                id="available"
                name="available"
                value={filters.available}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              >
                <option value="">All</option>
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Action in Progress Overlay */}
      {actionInProgress && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <FaSpinner className="animate-spin h-8 w-8 text-primary mx-auto" />
            <p className="mt-2 text-center text-gray-700">Processing...</p>
          </div>
        </div>
      )}

      {/* Property List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : properties.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {properties.map((property) => (
              <li key={property.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-16 bg-gray-200 rounded-md overflow-hidden">
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
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{property.title}</h3>
                        <div className="mt-1 flex items-center">
                          <FaMapMarkerAlt className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <p className="text-sm text-gray-500">{property.location}</p>
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          <span className="inline-flex items-center">
                            <FaBed className="mr-1 h-4 w-4" />
                            {property.bedrooms} beds
                          </span>
                          <span className="ml-3 inline-flex items-center">
                            <FaBath className="mr-1 h-4 w-4" />
                            {property.bathrooms} baths
                          </span>
                          <span className="ml-3 inline-flex items-center">
                            <FaRuler className="mr-1 h-4 w-4" />
                            {property.area_size} m²
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-6 flex flex-col items-end">
                      <div className="text-lg font-medium text-gray-900">
                        {formatCurrency(property.price)}
                      </div>
                      <div className="mt-1 flex items-center">
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            property.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {property.available ? 'Available' : 'Unavailable'}
                        </span>
                        <button 
                          onClick={() => handleAvailabilityToggle(property.id, property.available)}
                          className="ml-2 text-gray-400 hover:text-gray-500"
                          title={property.available ? 'Mark as unavailable' : 'Mark as available'}
                          disabled={actionInProgress}
                        >
                          {property.available ? (
                            <FaToggleOn className="h-5 w-5 text-green-500" />
                          ) : (
                            <FaToggleOff className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <div className="mt-2 flex space-x-2">
                        <Link 
                          href={`/properties/${property.id}`}
                          className="inline-flex items-center px-2 py-1 text-xs text-blue-600 hover:text-blue-800"
                        >
                          <FaEye className="mr-1 h-3 w-3" />
                          View
                        </Link>
                        <Link 
                          href={`/sales-ops/properties/${property.id}/edit`}
                          className="inline-flex items-center px-2 py-1 text-xs text-green-600 hover:text-green-800"
                        >
                          <FaEdit className="mr-1 h-3 w-3" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(property.id)}
                          className="inline-flex items-center px-2 py-1 text-xs text-red-600 hover:text-red-800"
                          disabled={actionInProgress}
                        >
                          <FaTrash className="mr-1 h-3 w-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          {totalCount > itemsPerPage && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${
                    page === 1 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(Math.min(Math.ceil(totalCount / itemsPerPage), page + 1))}
                  disabled={page >= Math.ceil(totalCount / itemsPerPage)}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${
                    page >= Math.ceil(totalCount / itemsPerPage) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(page - 1) * itemsPerPage + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(page * itemsPerPage, totalCount)}
                    </span>{' '}
                    of <span className="font-medium">{totalCount}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                        page === 1 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {/* Page numbers */}
                    {[...Array(Math.min(5, Math.ceil(totalCount / itemsPerPage)))].map((_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <button
                          key={i}
                          onClick={() => setPage(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                            page === pageNumber
                              ? 'bg-primary text-white hover:bg-primary-dark z-10'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setPage(Math.min(Math.ceil(totalCount / itemsPerPage), page + 1))}
                      disabled={page >= Math.ceil(totalCount / itemsPerPage)}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                        page >= Math.ceil(totalCount / itemsPerPage) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white text-center py-10 px-6 shadow sm:rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new property listing.
          </p>
          <div className="mt-6">
            <Link
              href="/sales-ops/properties/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <FaPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add New Property
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}