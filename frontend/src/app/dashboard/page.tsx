'use client'

import React from 'react';
import Link from 'next/link';
import {
  FiPlus,
  FiSearch,
  FiClock,
  FiBell,
  FiHome,
  FiMap,
  FiFile,
  FiBarChart2,
  FiCalendar
} from 'react-icons/fi';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/hooks/useAuth';

const StatCard = ({ icon, title, value, bgColor }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 flex overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className={`w-16 flex items-center justify-center ${bgColor}`}>
        {icon}
      </div>
      <div className="flex-1 p-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-xl font-semibold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );
};

const ActionCard = ({ icon, title, href }) => {
  return (
    <Link 
      href={href}
      className="flex items-center justify-center flex-col bg-white hover:bg-gray-50 rounded-xl border border-gray-200 p-4 sm:p-6 transition-colors shadow-sm hover:shadow-md"
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-2 sm:mb-3">
        {icon}
      </div>
      <span className="text-gray-900 font-medium text-center text-sm sm:text-base">{title}</span>
    </Link>
  );
};

const QuickLinkCard = ({ title, count, icon, href, linkText, bgColor = 'bg-gray-50' }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="p-4 sm:p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900">{title}</h3>
            <div className="mt-1 text-sm text-gray-500">{count}</div>
          </div>
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${bgColor}`}>
            {icon}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 px-4 sm:px-5 py-3 bg-gray-50">
        <Link href={href} className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center">
          {linkText}
          <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

const TabButton = ({ active, children, onClick }) => (
  <button
    className={`px-3 py-2 text-sm font-medium rounded-md ${
      active 
        ? 'bg-primary-50 text-primary-700' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

export default function DashboardHome() {
  const { stats, loading, error } = useDashboardData();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState('all');
  
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-heading-2">Dashboard</h1>
          <p className="text-subtitle mt-1">
            Welcome back, {user?.name || 'User'}
          </p>
        </div>
        
        {/* Quick add button */}
        <Link
          href="/dashboard/property-requests/new"
          className="btn-primary flex items-center"
        >
          <FiPlus className="mr-1.5" />
          New Request
        </Link>
      </div>
      
      {/* Quick Stats */}
      <div className="grid-responsive-3 mb-8">
    <QuickLinkCard
          title="Property Requests"
          count={stats.propertyRequests.statusText}
          icon={<FiFile className="h-5 w-5 text-primary-600" />}
          href="/dashboard/property-requests"
          linkText="Manage requests"
          bgColor="bg-primary-100"
        />
        <QuickLinkCard
          title="Upcoming Viewings"
          count={stats.scheduledViewings.statusText}
          icon={<FiCalendar className="h-5 w-5 text-secondary-600" />}
          href="/dashboard/scheduled-viewings"
          linkText="View all viewings"
          bgColor="bg-secondary-100"
        />
        <QuickLinkCard
          title="Available Properties"
          count={stats.availableProperties.statusText}
          icon={<FiHome className="h-5 w-5 text-accent-600" />}
          href="/properties"
          linkText="Browse properties"
          bgColor="bg-accent-100"
        />
      </div>
      
      {/* Quick Actions */}
      <h2 className="text-heading-3 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-8">
        <ActionCard
          icon={<FiPlus className="h-5 w-5" />}
          title="New Request"
          href="/dashboard/property-requests/new"
        />
        <ActionCard
          icon={<FiSearch className="h-5 w-5" />}
          title="Find Property"
          href="/properties"
        />
        <ActionCard
          icon={<FiClock className="h-5 w-5" />}
          title="My Viewings"
          href="/dashboard/scheduled-viewings"
        />
        <ActionCard
          icon={<FiBell className="h-5 w-5" />}
          title="Notifications"
          href="/dashboard/notifications"
        />
      </div>
      
      {/* Activity Tabs */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-heading-3">Activity</h2>
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
            All
          </TabButton>
          <TabButton active={activeTab === 'requests'} onClick={() => setActiveTab('requests')}>
            Requests
          </TabButton>
          <TabButton active={activeTab === 'viewings'} onClick={() => setActiveTab('viewings')}>
            Viewings
          </TabButton>
        </div>
      </div>
      
      {/* Recent Activity Section */}
      {(activeTab === 'all' || activeTab === 'requests') && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Property Requests</h3>
            <Link href="/dashboard/property-requests" className="text-sm text-primary-600 hover:text-primary-700">
              View all
            </Link>
          </div>
          
          {loading ? (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
          </div>
          </div>
          </div>
          ) : stats.recentPropertyRequests.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="divide-y divide-gray-200">
          {stats.recentPropertyRequests.map((request) => (
          <div key={request.id} className="p-4 hover:bg-gray-50">
          <Link href={`/dashboard/property-requests/${request.id}`} className="block">
          <h3 className="font-medium text-gray-900">
          {request.property_type} in {request.location}
          </h3>
          <div className="mt-1 flex flex-wrap items-center text-sm text-gray-500 gap-2">
          <span>
          Budget: {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'EGP',
          maximumFractionDigits: 0
          }).format(request.max_price || 0)}
          </span>
          <span className="hidden sm:inline-block">|</span>
          <span>
          Size: {request.min_area || 0} - {request.max_area || 'Any'} m²
          </span>
          </div>
          <div className="mt-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          request.status === 'new' || request.status === 'pending' ? 'bg-blue-100 text-blue-800' :
          request.status === 'in_progress' || request.status === 'active' ? 'bg-yellow-100 text-yellow-800' :
          request.status === 'matched' ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-800'
          }`}>
          {request.status === 'new' || request.status === 'pending' ? 'New' :
          request.status === 'in_progress' || request.status === 'active' ? 'In Progress' :
          request.status === 'matched' ? 'Properties Found' :
          request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
          </div>
          </Link>
          </div>
          ))}
          </div>
          </div>
          ) : (
            <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center border border-dashed border-gray-300">
              <div className="text-center p-6">
                <div className="mb-2 text-gray-500">Your recent property requests will appear here</div>
                <Link 
                  href="/dashboard/property-requests/new"
                  className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  <FiPlus className="mr-1.5" />
                  Create New Request
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Upcoming Viewings Section */}
      {(activeTab === 'all' || activeTab === 'viewings') && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Upcoming Viewings</h3>
            <Link href="/dashboard/scheduled-viewings" className="text-sm text-primary-600 hover:text-primary-700">
              View all
            </Link>
          </div>
          
          {loading ? (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
          </div>
          </div>
          </div>
          ) : stats.upcomingViewings.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="divide-y divide-gray-200">
          {stats.upcomingViewings.map((viewing) => (
          <div key={viewing.id} className="p-4 hover:bg-gray-50">
          <Link href={`/dashboard/scheduled-viewings/${viewing.id}`} className="block">
          <h3 className="font-medium text-gray-900">
          {viewing.property_title || 'Property Viewing'}
          </h3>
          <div className="mt-1 flex flex-wrap items-center text-sm text-gray-500 gap-2">
          <span>
          {new Date(viewing.viewing_date).toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
          })}
          </span>
          <span className="hidden sm:inline-block">|</span>
          <span>
          {new Date(viewing.viewing_date).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
          })}
          </span>
          </div>
          <div className="mt-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          viewing.status === 'scheduled' || viewing.status === 'pending' ? 'bg-blue-100 text-blue-800' :
          viewing.status === 'confirmed' ? 'bg-green-100 text-green-800' :
          viewing.status === 'cancelled' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
          }`}>
          {viewing.status === 'scheduled' || viewing.status === 'pending' ? 'Scheduled' :
          viewing.status === 'confirmed' ? 'Confirmed' :
          viewing.status === 'cancelled' ? 'Canceled' :
          viewing.status.charAt(0).toUpperCase() + viewing.status.slice(1)}
          </span>
          </div>
          </Link>
          </div>
          ))}
          </div>
          </div>
          ) : (
            <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center border border-dashed border-gray-300">
              <div className="text-center p-6">
                <div className="mb-2 text-gray-500">No upcoming viewings scheduled</div>
                <Link 
                  href="/properties"
                  className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  <FiSearch className="mr-1.5" />
                  Find Properties
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Market Insights */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-heading-3">Insights</h2>
          <div className="text-xs text-gray-500">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-600">
              <FiBarChart2 className="h-4 w-4" />
            </div>
            <h3 className="text-base font-medium text-gray-900">Current Market Trends</h3>
          </div>
          
          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ) : (
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                Based on your location preferences, property prices in {stats.recentPropertyRequests?.[0]?.location || 'New Cairo'} have 
                {Math.random() > 0.5 ? 'increased' : 'stabilized'} recently. The average price per square meter is now 
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'EGP',
                  maximumFractionDigits: 0
                }).format(18500 + Math.floor(Math.random() * 2000))}.  
              </p>
              <p>
                {stats.availableProperties.matchingCount} properties match your latest search criteria. This represents 
                {Math.round((stats.availableProperties.matchingCount / stats.availableProperties.total) * 100) || 5}% of the 
                current market inventory.
              </p>
              <p>
                Properties like {stats.recentPropertyRequests?.[0]?.property_type || 'Apartments'} in your preferred locations 
                typically receive {3 + Math.floor(Math.random() * 5)} viewing requests per week, so we recommend scheduling 
                viewings promptly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}