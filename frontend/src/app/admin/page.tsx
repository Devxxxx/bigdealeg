'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { motion } from 'framer-motion';
import {
  FiHome, FiUsers, FiSettings, FiDatabase,
  FiClipboard, FiCalendar, FiPieChart, FiTrendingUp,
  FiDollarSign, FiArrowUpRight, FiArrowDownRight,
  FiEye, FiCheckCircle, FiAlertCircle, FiClock,
  FiBell, FiPlus, FiGrid, FiMapPin, FiStar, FiInfo
} from 'react-icons/fi';
import Link from 'next/link';
import { getDashboardData } from '@/lib/api/admin';
import { toast } from 'react-hot-toast';

interface DashboardData {
  stats: {
    totalUsers: number;
    totalProperties: number;
    activeRequests: number;
    totalRevenue: number;
    newUsersThisMonth: number;
    newPropertiesThisWeek: number;
    percentChangeUsers: number;
    percentChangeRevenue: number;
    percentChangeProperties: number;
    percentChangeRequests: number;
  };
  activities: Array<{
    id: number;
    type: string;
    title: string;
    user: string;
    timestamp: string;
    status?: string;
  }>;
  alerts: Array<{
    id: number;
    type: 'warning' | 'error' | 'info' | 'success';
    message: string;
    time: string;
  }>;
}

export default function AdminDashboard() {
  const { user, session } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Check if we have a valid session with access token
        if (!session || !session.access_token) {
          console.error('No access token available');
          return;
        }

        const data = await getDashboardData(session.access_token);
        setDashboardData(data as DashboardData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [session]);

  // Get the activity icon based on type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <FiUsers className="text-blue-500" />;
      case 'property':
        return <FiHome className="text-primary-500" />;
      case 'request':
        return <FiClipboard className="text-purple-500" />;
      case 'viewing':
        return <FiCalendar className="text-green-500" />;
      default:
        return <FiInfo className="text-gray-500" />;
    }
  };

  // Get the alert icon based on type
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <FiAlertCircle className="text-amber-500" />;
      case 'error':
        return <FiAlertCircle className="text-red-500" />;
      case 'info':
        return <FiInfo className="text-blue-500" />;
      case 'success':
        return <FiCheckCircle className="text-green-500" />;
      default:
        return <FiInfo className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-full">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-primary-100 h-12 w-12 flex items-center justify-center mb-3">
              <FiPieChart className="h-6 w-6 text-primary-500" />
            </div>
            <p className="text-primary-600">Loading dashboard...</p>
          </div>
        </div>
    );
  }

  // If dashboardData is null after loading is complete, show an error state
  if (!dashboardData) {
    return (
        <div className="flex justify-center items-center h-full">
          <div className="text-center">
            <FiAlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Failed to Load Dashboard</h3>
            <p className="text-gray-600 mb-4">There was a problem fetching the dashboard data.</p>
            <Button
                variant="primary"
                onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </div>
    );
  }

  const { stats, activities, alerts } = dashboardData;

  return (
      <div className="pb-12">
        {/* Welcome Header */}
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-heading-2">Admin Dashboard</h1>
            <p className="text-subtitle mt-1">Welcome back, {user?.name || 'User'}!</p>
          </div>
          <div className="flex space-x-3">
            <Button
                variant="outline"
                leftIcon={<FiBell />}
                size="sm"
            >
              Notifications
            </Button>
            <Button
                variant="gradient"
                leftIcon={<FiPlus />}
                size="sm"
            >
              New Property
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
                </div>
                <div className="bg-blue-100 p-2 rounded-full">
                  <FiUsers className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-3 flex items-center">
              <span className={`text-sm font-medium flex items-center ${stats.percentChangeUsers >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.percentChangeUsers >= 0 ? (
                    <FiArrowUpRight className="mr-1" />
                ) : (
                    <FiArrowDownRight className="mr-1" />
                )}
                {Math.abs(stats.percentChangeUsers)}%
              </span>
                <span className="ml-2 text-xs text-gray-500">vs last month</span>
              </div>
            </Card>
          </motion.div>

          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Properties</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.totalProperties}</h3>
                </div>
                <div className="bg-primary-100 p-2 rounded-full">
                  <FiHome className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div className="mt-3 flex items-center">
              <span className={`text-sm font-medium flex items-center ${stats.percentChangeProperties >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.percentChangeProperties >= 0 ? (
                    <FiArrowUpRight className="mr-1" />
                ) : (
                    <FiArrowDownRight className="mr-1" />
                )}
                {Math.abs(stats.percentChangeProperties)}%
              </span>
                <span className="ml-2 text-xs text-gray-500">vs last month</span>
              </div>
            </Card>
          </motion.div>

          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active Requests</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.activeRequests}</h3>
                </div>
                <div className="bg-purple-100 p-2 rounded-full">
                  <FiClipboard className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-3 flex items-center">
              <span className={`text-sm font-medium flex items-center ${stats.percentChangeRequests >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.percentChangeRequests >= 0 ? (
                    <FiArrowUpRight className="mr-1" />
                ) : (
                    <FiArrowDownRight className="mr-1" />
                )}
                {Math.abs(stats.percentChangeRequests)}%
              </span>
                <span className="ml-2 text-xs text-gray-500">vs last month</span>
              </div>
            </Card>
          </motion.div>

          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card className="p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    ${stats.totalRevenue.toLocaleString()}
                  </h3>
                </div>
                <div className="bg-green-100 p-2 rounded-full">
                  <FiDollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-3 flex items-center">
              <span className={`text-sm font-medium flex items-center ${stats.percentChangeRevenue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.percentChangeRevenue >= 0 ? (
                    <FiArrowUpRight className="mr-1" />
                ) : (
                    <FiArrowDownRight className="mr-1" />
                )}
                {Math.abs(stats.percentChangeRevenue)}%
              </span>
                <span className="ml-2 text-xs text-gray-500">vs last month</span>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Middle Section: Charts and Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Chart Area - Takes 2/3 of the width on large screens */}
          <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
          >
            <Card className="p-6 h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
                <select className="border border-gray-200 rounded-md text-sm py-1 px-2">
                  <option>Last 30 Days</option>
                  <option>Last Quarter</option>
                  <option>This Year</option>
                  <option>All Time</option>
                </select>
              </div>

              {/* Chart Placeholder */}
              <div className="bg-gray-50 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <FiPieChart className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Chart visualization would be here</p>
                  <p className="text-xs text-gray-400 mt-1">Shows revenue, properties, and user growth over time</p>
                </div>
              </div>

              {/* Chart Legend - Optional */}
              <div className="flex justify-center space-x-8 mt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary-500 mr-2"></div>
                  <span className="text-xs text-gray-600">Properties</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-xs text-gray-600">Users</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-xs text-gray-600">Revenue</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Quick Stats - Takes 1/3 of the width on large screens */}
          <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-6 h-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Stats</h3>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Top Locations</span>
                    <Link href="/admin/analytics" className="text-xs text-primary-600 hover:text-primary-800">View All</Link>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FiMapPin className="w-4 h-4 text-primary-500 mr-2" />
                        <span className="text-sm">New Cairo</span>
                      </div>
                      <span className="text-sm font-medium">34%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FiMapPin className="w-4 h-4 text-primary-500 mr-2" />
                        <span className="text-sm">Sheikh Zayed</span>
                      </div>
                      <span className="text-sm font-medium">28%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FiMapPin className="w-4 h-4 text-primary-500 mr-2" />
                        <span className="text-sm">Maadi</span>
                      </div>
                      <span className="text-sm font-medium">16%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Popular Property Types</span>
                    <Link href="/admin/analytics" className="text-xs text-primary-600 hover:text-primary-800">Details</Link>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FiHome className="w-4 h-4 text-primary-500 mr-2" />
                        <span className="text-sm">Apartments</span>
                      </div>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FiHome className="w-4 h-4 text-primary-500 mr-2" />
                        <span className="text-sm">Villas</span>
                      </div>
                      <span className="text-sm font-medium">32%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FiHome className="w-4 h-4 text-primary-500 mr-2" />
                        <span className="text-sm">Townhouses</span>
                      </div>
                      <span className="text-sm font-medium">18%</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-primary-50 to-primary-100">
                  <div className="flex justify-between mb-3">
                    <span className="text-sm font-medium text-primary-900">Conversion Rate</span>
                    <span className="text-sm font-bold text-primary-700">8.7%</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2.5">
                    <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: '8.7%' }}></div>
                  </div>
                  <p className="text-xs text-primary-700 mt-2">
                    Percentage of property requests that result in sales
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Section: Recent Activity and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <Link href="/admin/activities" className="text-sm text-primary-600 hover:text-primary-800">
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start">
                      <div className="p-2 bg-gray-50 rounded-full mr-3">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                          <span className="text-xs text-gray-500">{activity.timestamp}</span>
                        </div>
                        <p className="text-xs text-gray-600">by {activity.user}</p>
                        {activity.status && (
                            <div className="mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                            activity.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-amber-100 text-amber-800'
                        }`}>
                          {activity.status}
                        </span>
                            </div>
                        )}
                      </div>
                    </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                <Button
                    variant="light"
                    size="sm"
                    className="text-primary-600"
                >
                  Load More
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* System Alerts */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
                <Button
                    variant="outline"
                    size="xs"
                    leftIcon={<FiBell />}
                >
                  Manage Alerts
                </Button>
              </div>

              <div className="space-y-4">
                {alerts.map((alert) => (
                    <div
                        key={alert.id}
                        className={`p-4 rounded-lg border ${
                            alert.type === 'warning' ? 'bg-amber-50 border-amber-200' :
                                alert.type === 'error' ? 'bg-red-50 border-red-200' :
                                    alert.type === 'info' ? 'bg-blue-50 border-blue-200' :
                                        'bg-green-50 border-green-200'
                        }`}
                    >
                      <div className="flex items-start">
                        <div className="mr-3 mt-0.5">
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-grow">
                          <p className={`text-sm font-medium ${
                              alert.type === 'warning' ? 'text-amber-800' :
                                  alert.type === 'error' ? 'text-red-800' :
                                      alert.type === 'info' ? 'text-blue-800' :
                                          'text-green-800'
                          }`}>
                            {alert.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                        </div>
                      </div>
                    </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button
                    variant="light"
                    className="justify-center"
                    leftIcon={<FiUsers />}
                    href="/admin/users"
                >
                  User Management
                </Button>
                <Button
                    variant="light"
                    className="justify-center"
                    leftIcon={<FiGrid />}
                    href="/admin/properties"
                >
                  Properties
                </Button>
                <Button
                    variant="light"
                    className="justify-center"
                    leftIcon={<FiSettings />}
                    href="/admin/settings"
                >
                  Settings
                </Button>
                <Button
                    variant="light"
                    className="justify-center"
                    leftIcon={<FiPieChart />}
                    href="/admin/analytics"
                >
                  Analytics
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
  );
}