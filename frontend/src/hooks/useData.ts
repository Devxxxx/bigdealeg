'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  propertyRequestsService, 
  propertiesService, 
  viewingsService, 
  notificationsService,
  cashbackService,
  activityService,
  insightsService
} from '@/lib/services';

// Format date function
export const formatDate = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const dateObj = new Date(date);
  const diffTime = Math.abs(now - dateObj);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 1) {
    const hours = Math.floor(diffTime / (1000 * 60 * 60));
    if (hours < 1) {
      const minutes = Math.floor(diffTime / (1000 * 60));
      return minutes < 1 ? 'Just now' : `${minutes} minutes ago`;
    }
    return `${hours} hours ago`;
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else {
    return dateObj.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-EG', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Hook for property requests
export const usePropertyRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        const data = await propertyRequestsService.getUserRequests(user.id);
        
        // Process the data
        const processedData = await Promise.all(data.map(async (request) => {
          const matchCount = await propertyRequestsService.getMatchCount(request.id);
          
          // Calculate new matches (for demo - in real app this would be stored)
          const newMatches = matchCount > 0 ? Math.floor(Math.random() * 3) : 0;
          
          return {
            ...request,
            match_count: matchCount,
            new_matches: newMatches,
            formatted_created_at: formatDate(request.created_at),
            price_range: `${formatCurrency(request.min_price)} - ${formatCurrency(request.max_price)} EGP`
          };
        }));
        
        setRequests(processedData);
      } catch (err) {
        console.error('Error fetching property requests:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRequests();
  }, [user]);
  
  const refreshRequests = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const data = await propertyRequestsService.getUserRequests(user.id);
      
      // Process the data
      const processedData = await Promise.all(data.map(async (request) => {
        const matchCount = await propertyRequestsService.getMatchCount(request.id);
        
        // Calculate new matches (for demo - in real app this would be stored)
        const newMatches = matchCount > 0 ? Math.floor(Math.random() * 3) : 0;
        
        return {
          ...request,
          match_count: matchCount,
          new_matches: newMatches,
          formatted_created_at: formatDate(request.created_at),
          price_range: `${formatCurrency(request.min_price)} - ${formatCurrency(request.max_price)} EGP`
        };
      }));
      
      setRequests(processedData);
    } catch (err) {
      console.error('Error refreshing property requests:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return { requests, isLoading, error, refreshRequests };
};

// Hook for a single property request
export const usePropertyRequest = (requestId) => {
  const { user } = useAuth();
  const [request, setRequest] = useState(null);
  const [matchedProperties, setMatchedProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchRequest = async () => {
      if (!user || !requestId) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        const requestData = await propertyRequestsService.getRequestById(requestId, user.id);
        const matchedProps = await propertiesService.getMatchedProperties(requestId);
        
        setRequest({
          ...requestData,
          formatted_created_at: formatDate(requestData.created_at),
          price_range: `${formatCurrency(requestData.min_price)} - ${formatCurrency(requestData.max_price)} EGP`
        });
        
        setMatchedProperties(matchedProps);
      } catch (err) {
        console.error('Error fetching property request:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRequest();
  }, [user, requestId]);
  
  return { request, matchedProperties, isLoading, error };
};

// Hook for viewings
export const useViewings = () => {
  const { user } = useAuth();
  const [viewings, setViewings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchViewings = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        const data = await viewingsService.getUserViewings(user.id);
        
        // Process the data
        const processedData = data.map(viewing => ({
          ...viewing,
          formatted_date: new Date(viewing.viewing_date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          formatted_time: new Date(viewing.viewing_date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          })
        }));
        
        setViewings(processedData);
      } catch (err) {
        console.error('Error fetching viewings:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchViewings();
  }, [user]);
  
  return { viewings, isLoading, error };
};

// Hook for notifications
export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        const data = await notificationsService.getUserNotifications(user.id);
        
        // Process the data
        const processedData = data.map(notification => ({
          ...notification,
          formatted_date: formatDate(notification.created_at)
        }));
        
        setNotifications(processedData);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotifications();
  }, [user]);
  
  const markAsRead = async (notificationId) => {
    try {
      await notificationsService.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(item => 
          item.id === notificationId ? { ...item, is_read: true } : item
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };
  
  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      await notificationsService.markAllAsRead(user.id);
      
      // Update local state
      setNotifications(prev => 
        prev.map(item => ({ ...item, is_read: true }))
      );
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };
  
  return { 
    notifications, 
    isLoading, 
    error, 
    markAsRead, 
    markAllAsRead,
    unreadCount: notifications.filter(n => !n.is_read).length
  };
};

// Hook for saved properties
export const useSavedProperties = () => {
  const { user } = useAuth();
  const [savedProperties, setSavedProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchSavedProperties = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        const data = await propertiesService.getSavedProperties(user.id);
        setSavedProperties(data);
      } catch (err) {
        console.error('Error fetching saved properties:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSavedProperties();
  }, [user]);
  
  return { savedProperties, isLoading, error };
};

// Hook for cashback
export const useCashback = () => {
  const { user } = useAuth();
  const [cashbacks, setCashbacks] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchCashbacks = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        const data = await cashbackService.getUserCashbacks(user.id);
        const total = await cashbackService.getTotalCashback(user.id);
        
        setCashbacks(data);
        setTotalAmount(total);
      } catch (err) {
        console.error('Error fetching cashbacks:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCashbacks();
  }, [user]);
  
  return { cashbacks, totalAmount, isLoading, error };
};

// Hook for user activity
export const useUserActivity = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchActivities = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        const data = await activityService.getUserActivities(user.id);
        
        // Process the data
        const processedData = data.map(activity => ({
          ...activity,
          formatted_date: formatDate(activity.created_at)
        }));
        
        setActivities(processedData);
      } catch (err) {
        console.error('Error fetching user activities:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActivities();
  }, [user]);
  
  return { activities, isLoading, error };
};

// Hook for market insights
export const useMarketInsights = () => {
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await insightsService.getMarketInsights();
        setInsights(data);
      } catch (err) {
        console.error('Error fetching market insights:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInsights();
  }, []);
  
  return { insights, isLoading, error };
};