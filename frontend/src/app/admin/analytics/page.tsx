'use client'

import { useState, useEffect } from 'react'
// import { useSupabase } from '@/components/providers/SupabaseProvider'
import {
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaUsers,
  FaHouseUser,
  FaCalendarCheck,
  FaCommentAlt,
  FaSearch,
  FaEye,
  FaFilter,
  FaFileDownload,
  FaSync
} from 'react-icons/fa'

// Analytics dashboard
export default function AdminAnalytics() {
  // const { supabase } = useSupabase()
  const [loading, setLoading] = useState(true)
  const [timeFrame, setTimeFrame] = useState('30days')
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalProperties: 0,
    totalRequests: 0,
    totalViewings: 0,
    conversionRate: 0,
    averageResponseTime: 0
  })

  const [propertyTypeDistribution, setPropertyTypeDistribution] = useState<any[]>([])
  const [locationDistribution, setLocationDistribution] = useState<any[]>([])
  const [dailyStats, setDailyStats] = useState<any[]>([])

  // Fetch analytics data
    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true)
            try {
                const response = await fetch(`/api/analytics?timeFrame=${timeFrame}`)
                if (!response.ok) throw new Error('Failed to fetch')
                const data = await response.json()

                // Set state based on your API response structure
                setStats(data.stats)
                setPropertyTypeDistribution(data.propertyTypeDistribution)
                setLocationDistribution(data.locationDistribution)
                setDailyStats(data.dailyStats)

                setLoading(false)
            } catch (error) {
                console.error('Error fetching analytics:', error)
                setLoading(false)
            }
        }

        fetchAnalytics()
    }, [timeFrame])

  // Helper to generate mock daily stats for chart
  const generateMockDailyStats = (days: number) => {
    const result = []
    const today = new Date()

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(today.getDate() - i)

      // Generate random numbers with some variations
      const views = Math.floor(Math.random() * 50) + 20
      const requests = Math.floor(Math.random() * 10) + 1
      const viewings = Math.floor(Math.random() * 5) + 1

      result.push({
        date: date.toISOString().split('T')[0],
        views,
        requests,
        viewings
      })
    }

    return result
  }

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FaChartLine className="mr-3 text-primary" />
              Analytics Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Monitor performance and user engagement metrics
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <select
              className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="12months">Last 12 Months</option>
            </select>

            <button
              onClick={() => setLoading(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <FaSync className="mr-2 h-4 w-4" />
              Refresh
            </button>

            <button
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <FaFileDownload className="mr-2 h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaUsers className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Users
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {loading ? '...' : formatNumber(stats.totalUsers)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-green-600">
                {loading ? '...' : formatNumber(stats.activeUsers)}
              </span>
              <span className="text-gray-500 ml-1">
                active in this period
              </span>
            </div>
          </div>
        </div>

        {/* Total Properties */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaHouseUser className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Properties Listed
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {loading ? '...' : formatNumber(stats.totalProperties)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-green-600">
                +{loading ? '...' : Math.floor(stats.totalProperties * 0.1)}
              </span>
              <span className="text-gray-500 ml-1">
                new in this period
              </span>
            </div>
          </div>
        </div>

        {/* Property Requests */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaSearch className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Property Requests
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {loading ? '...' : formatNumber(stats.totalRequests)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-primary">
                ~{loading ? '...' : stats.averageResponseTime}h
              </span>
              <span className="text-gray-500 ml-1">
                avg. response time
              </span>
            </div>
          </div>
        </div>

        {/* Scheduled Viewings */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaCalendarCheck className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Scheduled Viewings
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {loading ? '...' : formatNumber(stats.totalViewings)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-green-600">
                {loading ? '...' : stats.conversionRate}%
              </span>
              <span className="text-gray-500 ml-1">
                conversion rate
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Activity Overview</h2>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="h-80 relative">
              {/* This is a placeholder for a real chart component */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-6 rounded-lg border-2 border-dashed border-gray-300">
                  <FaChartBar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No chart component loaded</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    In a real implementation, this would display a line chart of daily views, requests, and viewings
                  </p>
                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      <FaEye className="mr-2 h-4 w-4" />
                      View Full Analytics
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Property Type Distribution */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Property Type Distribution</h2>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="h-64 relative">
                {/* This is a placeholder for a real chart component */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6 rounded-lg border-2 border-dashed border-gray-300">
                    <FaChartPie className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No chart component loaded</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      In a real implementation, this would display a pie chart of property types
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Location Distribution */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Top Locations</h2>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="h-64 relative">
                {/* This is a placeholder for a real chart component */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6 rounded-lg border-2 border-dashed border-gray-300">
                    <FaChartBar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No chart component loaded</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      In a real implementation, this would display a bar chart of top locations
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Table (simplified) */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>

          {loading ? (
            <div className="flex justify-center items-center h-24">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* This would be populated with real data */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      John Doe
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FaEye className="mr-1 h-3 w-3" /> Viewed Property
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Today, 10:25 AM
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Villa in Sheikh Zayed
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Jane Smith
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <FaCalendarCheck className="mr-1 h-3 w-3" /> Scheduled Viewing
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Today, 9:40 AM
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Apartment in Maadi
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Ahmed Hassan
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <FaCommentAlt className="mr-1 h-3 w-3" /> Sent Message
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Yesterday, 5:12 PM
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Office Space in Downtown Cairo
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
