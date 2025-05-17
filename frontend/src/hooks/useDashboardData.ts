'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import customerDashboardApi from '@/lib/api/customerDashboard';

/**
 * A hook to fetch dashboard data from the backend API
 */
export function useDashboardData() {
  const [stats, setStats] = useState({
    propertyRequests: {
      total: 0,
      newCount: 0,
      inProgressCount: 0,
      matchedCount: 0,
      statusText: 'Loading...'
    },
    scheduledViewings: {
      total: 0,
      upcomingCount: 0,
      statusText: 'Loading...'
    },
    availableProperties: {
      total: 0,
      matchingCount: 0,
      statusText: 'Loading...'
    },
    recentPropertyRequests: [],
    upcomingViewings: [],
    savedProperties: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, session } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user || !session?.access_token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      
      try {
        // Use the API client to fetch dashboard data
        const dashboardData = await customerDashboardApi.getDashboardData(session.access_token);
        
        // Update state with fetched data
        setStats(dashboardData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, session?.access_token]);

  return { stats, loading, error };
}