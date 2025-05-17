'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiDownload,
  FiHome,
  FiCalendar,
  FiList,
  FiCheckCircle,
  FiClock,
  FiBarChart2,
  FiUsers,
  FiMapPin,
  FiPhone,
  FiMail,
  FiAlertCircle
} from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import salesOpsApi from '@/lib/api/salesOps';

const StatsCard = ({ icon, title, value, change, changeType }) => {
  return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
          </div>
          <div className="bg-primary-100 text-primary-600 p-2 rounded-lg">
            {icon}
          </div>
        </div>
        {change && (
            <div className="mt-2">
          <span className={`text-xs font-medium ${
              changeType === 'increase' ? 'text-success-600' :
                  changeType === 'decrease' ? 'text-danger-600' : 'text-gray-500'
          }`}>
            {changeType === 'increase' ? '↑' : changeType === 'decrease' ? '↓' : ''} {change}
          </span>
            </div>
        )}
      </div>
  );
};

const RequestItem = ({ request }) => {
  // Format price range
  const formatPrice = (min, max) => {
    if (min && max) {
      return `${formatCurrency(min)} - ${formatCurrency(max)}`;
    } else if (min) {
      return `From ${formatCurrency(min)}`;
    } else if (max) {
      return `Up to ${formatCurrency(max)}`;
    }
    return 'Price not specified';
  };

  // Format area size
  const formatSize = (min, max) => {
    if (min && max) {
      return `${min} - ${max} sqm`;
    } else if (min) {
      return `From ${min} sqm`;
    } else if (max) {
      return `Up to ${max} sqm`;
    }
    return 'Size not specified';
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Unknown date';
    }
  };

  // Get status styling
  const getStatusStyle = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'matched':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-primary-100 text-primary-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'active':
        return 'bg-emerald-100 text-emerald-800';
      case 'closed':
        return 'bg-blue-gray-100 text-blue-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format status text for display
  const formatStatus = (status) => {
    switch (status) {
      case 'in_progress':
        return 'In Progress';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">{request.profile?.name || 'Unknown Customer'} - {request.property_type}</h3>
            <div className="flex flex-wrap gap-1 mb-2">
            <span className="inline-flex items-center text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
              <FiMapPin className="mr-1" size={12} /> {request.location}
            </span>
              <span className="inline-flex items-center text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
              {formatPrice(request.min_price, request.max_price)}
            </span>
              <span className="inline-flex items-center text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
              {formatSize(request.min_area, request.max_area)}
            </span>
            </div>
            <div className="text-xs text-gray-500 mb-2">{formatDate(request.created_at)}</div>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(request.status)}`}>
          {formatStatus(request.status)}
        </span>
        </div>
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center">
            <div className="flex items-center mr-3">
              <FiPhone className="text-gray-400 mr-1" size={14} />
              <span className="text-xs text-gray-600">{request.profile?.phone || 'No phone'}</span>
            </div>
            <div className="flex items-center">
              <FiMail className="text-gray-400 mr-1" size={14} />
              <span className="text-xs text-gray-600">{request.profile?.email || 'No email'}</span>
            </div>
          </div>
          <Link
              href={`/sales-ops/requests/${request.id}`}
              className="text-xs font-medium text-primary-600 hover:text-primary-700"
          >
            View Details
          </Link>
        </div>
      </div>
  );
};

const PropertyCard = ({ property }) => {
  // Function to format currency
  const formatCurrency = (value) => {
    try {
      return new Intl.NumberFormat('en-EG', {
        style: 'currency',
        currency: 'EGP',
        maximumFractionDigits: 0
      }).format(value);
    } catch (error) {
      return `${value} EGP`;
    }
  };

  // Function to get the image URL with a fallback
  const getImageUrl = (property) => {
    if (property.featured_image) {
      return property.featured_image;
    } else if (property.image_urls && property.image_urls.length > 0) {
      return property.image_urls[0];
    }
    return '/api/placeholder/600/400';
  };

  return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
        <div className="h-40 relative">
          <img
              src={getImageUrl(property)}
              alt={property.title}
              className="w-full h-full object-cover"
          />
          <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full ${
              property.available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
          {property.available ? 'Available' : 'Not Available'}
        </span>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 truncate">{property.title}</h3>
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <FiMapPin size={12} className="mr-1" />
            {property.location}
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
          <span className="inline-flex items-center text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
            {property.property_type}
          </span>
            <span className="inline-flex items-center text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
            {property.area_size} sqm
          </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <div className="font-bold text-gray-900">{formatCurrency(property.price)}</div>
            <Link
                href={`/sales-ops/properties/${property.id}`}
                className="text-xs font-medium text-primary-600 hover:text-primary-700"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
  );
};

const ViewingItem = ({ viewing }) => {
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not set';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Get status styling
  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              {viewing.property?.title || 'Unknown Property'}
            </h3>
            <div className="flex items-center text-xs text-gray-500 mb-2">
              <FiMapPin size={12} className="mr-1" />
              {viewing.property?.location || 'Location not specified'}
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
            <span className="inline-flex items-center text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
              <FiCalendar className="mr-1" size={12} /> {formatDate(viewing.viewing_date)}
            </span>
              <span className="inline-flex items-center text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
              <FiClock className="mr-1" size={12} /> {viewing.viewing_time || 'Time not set'}
            </span>
            </div>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(viewing.status)}`}>
          {viewing.status.charAt(0).toUpperCase() + viewing.status.slice(1)}
        </span>
        </div>
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center">
            <div className="font-medium text-sm text-gray-900">{viewing.profile?.name || 'Unknown Client'}</div>
          </div>
          <Link
              href={`/sales-ops/scheduled-viewings/${viewing.id}`}
              className="text-xs font-medium text-primary-600 hover:text-primary-700"
          >
            View Details
          </Link>
        </div>
      </div>
  );
};

// Utility function to format currency
const formatCurrency = (value) => {
  if (!value) return 'N/A';

  try {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      maximumFractionDigits: 0
    }).format(value);
  } catch (error) {
    return `${value} EGP`;
  }
};

export default function SalesOpsDashboard() {
  const [activeTab, setActiveTab] = useState('today');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data states
  const [stats, setStats] = useState({
    customerRequests: 0,
    scheduledViewings: 0,
    properties: 0,
    successRate: 0
  });
  const [properties, setProperties] = useState([]);
  const [requests, setRequests] = useState([]);
  const [viewings, setViewings] = useState([]);

  const { user, session } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);

      if (!session?.access_token) {
        setError('Authentication required');
        setIsLoading(false);
        return;
      }

      try {
        // Use the new API client to fetch dashboard data
        const dashboardData = await salesOpsApi.getDashboardData(session.access_token);
        
        // Update state with fetched data
        setStats(dashboardData.stats);
        setProperties(dashboardData.recentData.properties || []);
        setRequests(dashboardData.recentData.requests || []);
        setViewings(dashboardData.recentData.viewings || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [session?.access_token]);

  // Format stats for display
  const statsCards = [
    {
      title: 'Customer Requests',
      value: stats.customerRequests.toString(),
      change: '+18% vs last month',
      changeType: 'increase',
      icon: <FiList size={20} />
    },
    {
      title: 'Scheduled Viewings',
      value: stats.scheduledViewings.toString(),
      change: '+5% vs last month',
      changeType: 'increase',
      icon: <FiCalendar size={20} />
    },
    {
      title: 'Properties',
      value: stats.properties.toString(),
      change: '-2% vs last month',
      changeType: 'decrease',
      icon: <FiHome size={20} />
    },
    {
      title: 'Success Rate',
      value: `${stats.successRate}%`,
      change: '+8% vs last month',
      changeType: 'increase',
      icon: <FiCheckCircle size={20} />
    }
  ];

  // Filter viewings based on active tab
  const filterViewings = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (activeTab) {
      case 'today':
        return viewings.filter(viewing => {
          if (!viewing.viewing_date) return false;
          const viewingDate = new Date(viewing.viewing_date);
          viewingDate.setHours(0, 0, 0, 0);
          return viewingDate.getTime() === today.getTime();
        });
      case 'upcoming':
        return viewings.filter(viewing => {
          if (!viewing.viewing_date) return false;
          const viewingDate = new Date(viewing.viewing_date);
          viewingDate.setHours(0, 0, 0, 0);
          return viewingDate.getTime() >= today.getTime();
        });
      case 'all':
      default:
        return viewings;
    }
  };

  // Loading state
  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
    );
  }

  // Error state
  if (error) {
    return (
        <div className="p-6 bg-red-50 rounded-lg border border-red-200 text-red-700">
          <div className="flex items-center mb-3">
            <FiAlertCircle className="mr-2 text-red-500" size={20} />
            <h3 className="font-semibold">Error Loading Dashboard Data</h3>
          </div>
          <p>{error}</p>
          <button
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
    );
  }

  return (
      <div>
        {/* Page Header */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-heading-2">Sales Dashboard</h1>
            <p className="text-subtitle mt-1">Overview of sales operations and customer activity</p>
          </div>

          <div className="flex gap-2">
            <button className="btn-outline flex items-center">
              <FiDownload className="mr-2" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <Link
                href="/sales-ops/properties/new"
                className="btn-primary flex items-center"
            >
              <FiPlus className="mr-1.5" />
              <span className="hidden sm:inline">Add Property</span>
              <span className="sm:hidden">Add</span>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid-responsive-4 mb-8">
          {statsCards.map((stat, index) => (
              <StatsCard
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  changeType={stat.changeType}
                  icon={stat.icon}
              />
          ))}
        </div>

        {/* Requests Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h2 className="text-heading-3">Customer Requests</h2>
            <div className="flex items-center mt-2 sm:mt-0">
              <div className="relative mr-3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search requests..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <button className="btn-outline flex items-center text-sm">
                <FiFilter className="mr-2" />
                Filter
              </button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {requests.length > 0 ? (
                requests.map(request => (
                    <RequestItem key={request.id} request={request} />
                ))
            ) : (
                <div className="col-span-3 bg-gray-50 rounded-lg p-6 text-center border border-dashed border-gray-300">
                  <p className="text-gray-500">No customer requests found</p>
                </div>
            )}
          </div>
          <div className="mt-4 text-center">
            <Link
                href="/sales-ops/requests"
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              View All Requests
            </Link>
          </div>
        </div>

        {/* Viewings Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h2 className="text-heading-3">Viewings</h2>
            <div className="flex bg-gray-100 p-1 rounded-lg text-sm">
              <button
                  className={`px-3 py-1.5 rounded-md ${activeTab === 'today' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'}`}
                  onClick={() => setActiveTab('today')}
              >
                Today
              </button>
              <button
                  className={`px-3 py-1.5 rounded-md ${activeTab === 'upcoming' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'}`}
                  onClick={() => setActiveTab('upcoming')}
              >
                Upcoming
              </button>
              <button
                  className={`px-3 py-1.5 rounded-md ${activeTab === 'all' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'}`}
                  onClick={() => setActiveTab('all')}
              >
                All
              </button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterViewings().length > 0 ? (
                filterViewings().map(viewing => (
                    <ViewingItem key={viewing.id} viewing={viewing} />
                ))
            ) : (
                <div className="col-span-3 bg-gray-50 rounded-lg p-6 text-center border border-dashed border-gray-300">
                  <p className="text-gray-500">No viewings found for the selected period</p>
                </div>
            )}
          </div>
          <div className="mt-4 text-center">
            <Link
                href="/sales-ops/scheduled-viewings"
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              View All Viewings
            </Link>
          </div>
        </div>

        {/* Recent Properties Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h2 className="text-heading-3">Recent Properties</h2>
            <div className="mt-2 sm:mt-0">
              <button className="btn-outline flex items-center text-sm">
                <FiFilter className="mr-2" />
                Filter
              </button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {properties.length > 0 ? (
                properties.map(property => (
                    <PropertyCard key={property.id} property={property} />
                ))
            ) : (
                <div className="col-span-3 bg-gray-50 rounded-lg p-6 text-center border border-dashed border-gray-300">
                  <p className="text-gray-500">No properties found</p>
                </div>
            )}
          </div>
          <div className="mt-4 text-center">
            <Link
                href="/sales-ops/properties"
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              View All Properties
            </Link>
          </div>
        </div>

        {/* Performance Metrics */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-heading-3">Performance Metrics</h2>
            <div className="text-xs text-gray-500">Last 30 days</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-600">
                <FiBarChart2 className="h-4 w-4" />
              </div>
              <h3 className="text-base font-medium text-gray-900">Activity Summary</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Request to Viewing Ratio</h4>
                <div className="flex items-end mb-2">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.scheduledViewings > 0 && stats.customerRequests > 0
                        ? Math.round((stats.scheduledViewings / stats.customerRequests) * 100)
                        : 0}%
                  </div>
                  <div className="ml-2 text-sm text-success-600">↑ 12%</div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                      className="h-full bg-primary-600 rounded-full"
                      style={{
                        width: `${stats.scheduledViewings > 0 && stats.customerRequests > 0
                            ? Math.round((stats.scheduledViewings / stats.customerRequests) * 100)
                            : 0}%`
                      }}
                  ></div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Viewing to Sale Ratio</h4>
                <div className="flex items-end mb-2">
                  <div className="text-2xl font-bold text-gray-900">{stats.successRate}%</div>
                  <div className="ml-2 text-sm text-success-600">↑ 8%</div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary-600 rounded-full" style={{ width: `${stats.successRate}%` }}></div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm text-gray-600">
              <p>
                Your performance has improved by 12% compared to the previous month. The average time to process a customer request has decreased from 2.4 days to 1.8 days.
              </p>
              <p>
                Conversion rates for high-value properties (over 10M EGP) have increased by 15%, while middle-range properties have remained stable.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}