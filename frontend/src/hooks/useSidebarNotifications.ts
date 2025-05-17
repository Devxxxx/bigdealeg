'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import notificationApi from '@/lib/api/notification';

/**
 * A hook to provide notification counts for the sidebar
 * Uses the backend API instead of direct Supabase connections
 */
export function useSidebarNotifications() {
  const [notifications, setNotifications] = useState({
    propertyRequests: 0,
    scheduledViewings: 0,
    savedProperties: 0,
    messages: 0
  });
  const [loading, setLoading] = useState(true);
  const { user, session } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user || !session?.access_token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch notifications from API
        const notificationCounts = await notificationApi.getSidebarNotifications(session.access_token);
        setNotifications(notificationCounts);
      } catch (error) {
        console.error('Error fetching notification counts:', error);
        // Reset notifications on error
        setNotifications({
          propertyRequests: 0,
          scheduledViewings: 0,
          savedProperties: 0,
          messages: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Refresh every 2 minutes
    const interval = setInterval(fetchNotifications, 120000);
    
    // Clean up interval
    return () => {
      clearInterval(interval);
    };
  }, [user, session]);

  return { notifications, loading };
}