'use client';

import { useState, useEffect } from 'react';
import { propertyRequestService, propertyService, viewingService, userService, insightService } from './services';

/**
 * Hook for property requests
 */
export function usePropertyRequests() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchRequests = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await propertyRequestService.getUserRequests();
      setRequests(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch property requests');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchRequests();
  }, []);
  
  const createRequest = async (requestData) => {
    try {
      const newRequest = await propertyRequestService.createRequest(requestData);
      setRequests(prev => [newRequest, ...prev]);
      return newRequest;
    } catch (err) {
      setError(err.message || 'Failed to create property request');
      console.error(err);
      throw err;
    }
  };
  
  const updateRequest = async (requestId, requestData) => {
    try {
      const updatedRequest = await propertyRequestService.updateRequest(requestId, requestData);
      setRequests(prev => prev.map(req => 
        req.id === requestId ? updatedRequest : req
      ));
      return updatedRequest;
    } catch (err) {
      setError(err.message || 'Failed to update property request');
      console.error(err);
      throw err;
    }
  };
  
  const deleteRequest = async (requestId) => {
    try {
      await propertyRequestService.deleteRequest(requestId);
      setRequests(prev => prev.filter(req => req.id !== requestId));
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete property request');
      console.error(err);
      throw err;
    }
  };
  
  return {
    requests,
    isLoading,
    error,
    createRequest,
    updateRequest,
    deleteRequest,
    refreshRequests: fetchRequests
  };
}

/**
 * Hook for a single property request
 */
export function usePropertyRequest(requestId) {
  const [request, setRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchRequest = async () => {
    if (!requestId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await propertyRequestService.getRequestById(requestId);
      setRequest(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch property request');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchRequest();
  }, [requestId]);
  
  return {
    request,
    isLoading,
    error,
    refreshRequest: fetchRequest
  };
}

/**
 * Hook for property matches
 */
export function usePropertyMatches(requestId) {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchMatches = async () => {
    if (!requestId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await propertyRequestService.getPropertyMatches(requestId);
      setMatches(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch property matches');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMatches();
  }, [requestId]);
  
  return {
    matches,
    isLoading,
    error,
    refreshMatches: fetchMatches
  };
}

/**
 * Hook for properties
 */
export function useProperties() {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchProperties = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await propertyService.getAllProperties();
      setProperties(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch properties');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProperties();
  }, []);
  
  return {
    properties,
    isLoading,
    error,
    refreshProperties: fetchProperties
  };
}

/**
 * Hook for a single property
 */
export function useProperty(propertyId) {
  const [property, setProperty] = useState(null);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchProperty = async () => {
    if (!propertyId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const propertyData = await propertyService.getPropertyById(propertyId);
      const imagesData = await propertyService.getPropertyImages(propertyId);
      
      setProperty(propertyData);
      setImages(imagesData);
    } catch (err) {
      setError(err.message || 'Failed to fetch property');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProperty();
  }, [propertyId]);
  
  return {
    property,
    images,
    isLoading,
    error,
    refreshProperty: fetchProperty
  };
}

/**
 * Hook for scheduled viewings
 */
export function useViewings() {
  const [viewings, setViewings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchViewings = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await viewingService.getUserViewings();
      setViewings(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch viewings');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchViewings();
  }, []);
  
  const scheduleViewing = async (viewingData) => {
    try {
      const newViewing = await viewingService.scheduleViewing(viewingData);
      setViewings(prev => [newViewing, ...prev]);
      return newViewing;
    } catch (err) {
      setError(err.message || 'Failed to schedule viewing');
      console.error(err);
      throw err;
    }
  };
  
  return {
    viewings,
    isLoading,
    error,
    scheduleViewing,
    refreshViewings: fetchViewings
  };
}

/**
 * Hook for user profile
 */
export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await userService.getUserProfile();
      setProfile(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch user profile');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProfile();
  }, []);
  
  const updateProfile = async (profileData) => {
    try {
      const updatedProfile = await userService.updateUserProfile(profileData);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      console.error(err);
      throw err;
    }
  };
  
  return {
    profile,
    isLoading,
    error,
    updateProfile,
    refreshProfile: fetchProfile
  };
}

/**
 * Hook for notifications
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchNotifications = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await userService.getUserNotifications();
      setNotifications(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch notifications');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchNotifications();
  }, []);
  
  const markAsRead = async (notificationId) => {
    try {
      await userService.markNotificationAsRead(notificationId);
      setNotifications(prev => prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, is_read: true }
          : notification
      ));
    } catch (err) {
      setError(err.message || 'Failed to mark notification as read');
      console.error(err);
    }
  };
  
  return {
    notifications,
    unreadCount: notifications.filter(n => !n.is_read).length,
    isLoading,
    error,
    markAsRead,
    refreshNotifications: fetchNotifications
  };
}

/**
 * Hook for market insights
 */
export function useMarketInsights() {
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchInsights = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await insightService.getMarketInsights();
      setInsights(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch market insights');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchInsights();
  }, []);
  
  return {
    insights,
    isLoading,
    error,
    refreshInsights: fetchInsights
  };
}