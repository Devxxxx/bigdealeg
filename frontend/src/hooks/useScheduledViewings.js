'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import scheduledViewingApi from '@/lib/api/scheduledViewing';

/**
 * Hook to manage scheduled viewings
 * @param {Object} options - Options for the hook
 * @param {string} options.filter - Filter for viewings (all, upcoming, past)
 * @param {Object} options.additionalFilters - Additional filters for the API
 * @returns {Object} - Scheduled viewings data and functions
 */
export function useScheduledViewings(options = {}) {
  const { filter = 'all', additionalFilters = {} } = options;
  const [viewings, setViewings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
  const { user, session } = useAuth();

  // Stringify additionalFilters to avoid dependency issues
  const additionalFiltersString = JSON.stringify(additionalFilters);

  // Fetch viewings from the API
  const fetchViewings = useCallback(async () => {
    // Prevent fetching if we're already loading or if there's no session/user
    if (!user || !session?.access_token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Parse the stringified filters
      const apiFilters = { 
        ...JSON.parse(additionalFiltersString),
        role: user?.role // Include the user's role in the request
      };

      // User ID is automatically added by the backend based on the token
      // so we don't need to add it here

      const { viewings: data } = await scheduledViewingApi.getScheduledViewings(
        session.access_token,
        apiFilters
      );

      console.log('Scheduled viewings data received:', data);
      setViewings(data || []);
      setHasInitiallyLoaded(true);
      if (data) {
        console.log(`Received ${data.length} viewings from API`);
      } else {
        console.log('No viewings data received or data is empty');
      }
    } catch (err) {
      console.error('Error fetching scheduled viewings:', err);
      setError('Failed to load scheduled viewings');
    } finally {
      setLoading(false);
    }
  }, [user?.id, session?.access_token, additionalFiltersString]);

  // Fetch viewings on component mount and when dependencies change, but only if not already loading
  useEffect(() => {
    fetchViewings();
  }, [fetchViewings]);

  // Filter viewings based on date (upcoming or past)
  const filteredViewings = viewings.filter(viewing => {
    if (filter === 'all') return true;
    
    // Always show pending viewings in 'upcoming' filter
    if (viewing.status === 'pending' && filter === 'upcoming') {
      return true;
    }
    
    // Skip viewings without dates
    if (!viewing.viewing_date) {
      return filter === 'upcoming';
    }
    
    const viewingDate = new Date(viewing.viewing_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for fair comparison
    
    if (filter === 'upcoming') {
      return viewingDate >= today;
    } else if (filter === 'past') {
      return viewingDate < today;
    }
    return true;
  });

  // Group viewings by date
  const groupedViewings = filteredViewings.reduce((acc, viewing) => {
    // For pending viewings without a confirmed date, group them separately
    if (viewing.status === 'pending' && !viewing.viewing_date) {
      const dateGroup = 'Pending Confirmation';
      if (!acc[dateGroup]) {
        acc[dateGroup] = [];
      }
      acc[dateGroup].push(viewing);
      return acc;
    }
    
    const dateGroup = formatDateForGrouping(viewing.viewing_date);
    if (!acc[dateGroup]) {
      acc[dateGroup] = [];
    }
    acc[dateGroup].push(viewing);
    return acc;
  }, {});

  // Cancel a viewing
  const cancelViewing = async (viewingId, reason) => {
    if (!session?.access_token) {
      throw new Error('You must be logged in to cancel a viewing');
    }

    try {
      const cancelData = {
        cancellation_reason: reason
      };

      const result = await scheduledViewingApi.cancelScheduledViewing(
        session.access_token,
        viewingId,
        cancelData
      );

      // Update the viewings in state
      setViewings(prev => 
        prev.map(viewing => 
          viewing.id === viewingId 
            ? { ...viewing, status: 'cancelled' } 
            : viewing
        )
      );

      return result;
    } catch (err) {
      console.error('Error cancelling viewing:', err);
      throw err;
    }
  };

  // Create a new viewing
  const createViewing = async (viewingData) => {
    if (!session?.access_token) {
      throw new Error('You must be logged in to schedule a viewing');
    }

    try {
      const result = await scheduledViewingApi.createScheduledViewing(
        session.access_token,
        viewingData
      );

      // Add the new viewing to state
      setViewings(prev => [result, ...prev]);

      return result;
    } catch (err) {
      console.error('Error creating viewing:', err);
      throw err;
    }
  };

  // Format date for grouping
  function formatDateForGrouping(dateString) {
    if (!dateString) return 'Pending Confirmation';
    
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Reset hours to compare dates only
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    if (date.getTime() === today.getTime()) return 'Today';
    if (date.getTime() === tomorrow.getTime()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  return {
    viewings: filteredViewings,
    groupedViewings,
    loading,
    error,
    hasData: viewings.length > 0,
    hasInitiallyLoaded,
    refreshViewings: fetchViewings,
    cancelViewing,
    createViewing
  };
}