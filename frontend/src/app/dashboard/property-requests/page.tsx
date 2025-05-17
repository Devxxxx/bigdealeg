'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiCalendar,
  FiChevronDown,
  FiMapPin,
  FiHome,
  FiDollarSign,
  FiClock,
  FiAlertCircle,
  FiLoader
} from 'react-icons/fi';
import { usePropertyRequests } from '@/hooks/usePropertyRequests';
import { formatDistanceToNow } from 'date-fns';

// Status badge component
const StatusBadge = ({ status }) => {
  const statusStyles = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  
  return (
    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusStyles[status.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

// Format price range
const formatPriceRange = (minPrice, maxPrice) => {
  const formatPrice = (price) => {
    if (!price) return '';
    return price.toLocaleString('en-US');
  };
  
  if (minPrice && maxPrice) {
    return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)} EGP`;
  } else if (minPrice) {
    return `${formatPrice(minPrice)}+ EGP`;
  } else if (maxPrice) {
    return `Up to ${formatPrice(maxPrice)} EGP`;
  }
  
  return 'Price not specified';
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString;
  }
};

// Property request card component
const PropertyRequestCard = ({ request }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-medium text-gray-900">{request.title}</h3>
          <StatusBadge status={request.status} />
        </div>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <FiMapPin className="mr-2 text-gray-400 flex-shrink-0" />
            <span className="truncate">{request.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FiHome className="mr-2 text-gray-400 flex-shrink-0" />
            <span>{request.property_type}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FiDollarSign className="mr-2 text-gray-400 flex-shrink-0" />
            <span>{formatPriceRange(request.min_price, request.max_price)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FiClock className="mr-2 text-gray-400 flex-shrink-0" />
            <span>{formatDate(request.created_at)}</span>
          </div>
        </div>
        
        <div className="mt-3 text-sm">
          <span className="text-primary-600 font-medium">{request.match_count || 0}</span> properties matched
          {request.new_matches > 0 && (
            <span className="ml-2 bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full text-xs">
              {request.new_matches} new
            </span>
          )}
        </div>
      </div>
      
      <div className="border-t border-gray-200 py-3 px-4 flex justify-between bg-gray-50">
        <Link href={`/dashboard/property-requests/${request.id}`} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View Details
        </Link>
        <Link href={`/dashboard/property-requests/${request.id}/edit`} className="text-sm text-gray-600 hover:text-gray-900">
          Edit Request
        </Link>
      </div>
    </div>
  );
};

// Empty state component
const EmptyState = ({ searchQuery, onCreateNew }) => (
  <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <FiSearch className="text-gray-400 w-6 h-6" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
    <p className="text-gray-600 mb-4">
      {searchQuery
        ? `No property requests matched your search "${searchQuery}"`
        : "You haven't created any property requests yet."}
    </p>
    <button
      onClick={onCreateNew}
      className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
    >
      <FiPlus className="mr-2" />
      Create New Request
    </button>
  </div>
);

// Error state component
const ErrorState = ({ error, onRetry }) => (
  <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
      <FiAlertCircle className="text-red-500 w-6 h-6" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading requests</h3>
    <p className="text-gray-600 mb-4">{error}</p>
    <button
      onClick={onRetry}
      className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
    >
      Retry
    </button>
  </div>
);

export default function PropertyRequestsPage() {
  const { 
    requests, 
    loading, 
    error, 
    fetchRequests, 
    updateFilters,
    filters
  } = usePropertyRequests({ loadOnMount: true });
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const router = usePathname();
  
  // Handle create new request
  const handleCreateNew = () => {
    window.location.href = '/dashboard/property-requests/new';
  };
  
  // Filter requests based on search query and status filter
  const filteredRequests = requests?.filter(request => {
    // Search filter
    if (searchQuery && !request.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Status filter
    if (statusFilter !== 'All' && request.status !== statusFilter.toLowerCase()) {
      return false;
    }
    
    return true;
  }) || [];
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isFiltersOpen && !event.target.closest('.filters-dropdown')) {
        setIsFiltersOpen(false);
      }
      if (isDateOpen && !event.target.closest('.date-dropdown')) {
        setIsDateOpen(false);
      }
      if (isStatusOpen && !event.target.closest('.status-dropdown')) {
        setIsStatusOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFiltersOpen, isDateOpen, isStatusOpen]);
  
  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Property Requests</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your property requirements and track matches
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <Link
            href="/dashboard/property-requests/new"
            className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <FiPlus className="mr-1.5" />
            New Request
          </Link>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Search bar */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search requests..."
              className="block w-full border border-gray-300 rounded-lg py-2 pl-10 pr-3 placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Filter buttons */}
          <div className="flex space-x-2">
            {/* Filters */}
            <div className="relative filters-dropdown">
              <button
                type="button"
                className="inline-flex items-center justify-between bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 min-w-[100px]"
                onClick={() => {
                  setIsFiltersOpen(!isFiltersOpen);
                  setIsDateOpen(false);
                  setIsStatusOpen(false);
                }}
              >
                <div className="flex items-center">
                  <FiFilter className="mr-2 text-gray-500" />
                  Filters
                </div>
                <FiChevronDown className="ml-2 text-gray-500" />
              </button>
              
              {isFiltersOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="p-3">
                    <div className="font-medium text-gray-700 mb-2">Filter by</div>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Property Type</label>
                        <select className="w-full border border-gray-300 rounded-lg py-1.5 px-3 text-sm">
                          <option>Any</option>
                          <option>Apartment</option>
                          <option>Villa</option>
                          <option>Office</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Price Range</label>
                        <select className="w-full border border-gray-300 rounded-lg py-1.5 px-3 text-sm">
                          <option>Any</option>
                          <option>Under 1M</option>
                          <option>1M - 3M</option>
                          <option>3M - 5M</option>
                          <option>Over 5M</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium py-1.5 px-3 rounded-lg"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Date Filter */}
            <div className="relative date-dropdown">
              <button
                type="button"
                className="inline-flex items-center justify-between bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 min-w-[100px]"
                onClick={() => {
                  setIsDateOpen(!isDateOpen);
                  setIsFiltersOpen(false);
                  setIsStatusOpen(false);
                }}
              >
                <div className="flex items-center">
                  <FiCalendar className="mr-2 text-gray-500" />
                  Date
                </div>
                <FiChevronDown className="ml-2 text-gray-500" />
              </button>
              
              {isDateOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="p-3">
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="radio" name="date" className="h-4 w-4 text-primary-600" />
                        <span className="ml-2 text-sm text-gray-700">All time</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="date" className="h-4 w-4 text-primary-600" />
                        <span className="ml-2 text-sm text-gray-700">Last 7 days</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="date" className="h-4 w-4 text-primary-600" />
                        <span className="ml-2 text-sm text-gray-700">Last 30 days</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="date" className="h-4 w-4 text-primary-600" />
                        <span className="ml-2 text-sm text-gray-700">Last 3 months</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="date" className="h-4 w-4 text-primary-600" />
                        <span className="ml-2 text-sm text-gray-700">Custom range</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Status Filter */}
            <div className="relative status-dropdown">
              <button
                type="button"
                className="inline-flex items-center justify-between bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 min-w-[100px]"
                onClick={() => {
                  setIsStatusOpen(!isStatusOpen);
                  setIsFiltersOpen(false);
                  setIsDateOpen(false);
                }}
              >
                <div className="flex items-center">
                  Status
                </div>
                <FiChevronDown className="ml-2 text-gray-500" />
              </button>
              
              {isStatusOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="p-3">
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="status" 
                          className="h-4 w-4 text-primary-600"
                          checked={statusFilter === 'All'}
                          onChange={() => {
                            setStatusFilter('All');
                            updateFilters({ status: undefined });
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-700">All</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="status" 
                          className="h-4 w-4 text-primary-600"
                          checked={statusFilter === 'Active'}
                          onChange={() => {
                            setStatusFilter('Active');
                            updateFilters({ status: 'active' });
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-700">Active</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="status" 
                          className="h-4 w-4 text-primary-600"
                          checked={statusFilter === 'Pending'}
                          onChange={() => {
                            setStatusFilter('Pending');
                            updateFilters({ status: 'pending' });
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-700">Pending</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="status" 
                          className="h-4 w-4 text-primary-600"
                          checked={statusFilter === 'Completed'}
                          onChange={() => {
                            setStatusFilter('Completed');
                            updateFilters({ status: 'completed' });
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-700">Completed</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="status" 
                          className="h-4 w-4 text-primary-600"
                          checked={statusFilter === 'Cancelled'}
                          onChange={() => {
                            setStatusFilter('Cancelled');
                            updateFilters({ status: 'cancelled' });
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-700">Cancelled</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Loading, Error, Empty or Request Cards */}
      {loading ? (
        <div className="flex justify-center items-center p-12">
          <FiLoader className="animate-spin h-8 w-8 text-primary-600 mr-2" />
          <span className="text-gray-600">Loading property requests...</span>
        </div>
      ) : error ? (
        <ErrorState error={error} onRetry={fetchRequests} />
      ) : filteredRequests.length === 0 ? (
        <EmptyState searchQuery={searchQuery} onCreateNew={handleCreateNew} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map(request => (
            <PropertyRequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
}