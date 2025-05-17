'use client';

import propertyApi from './api/property';

/**
 * Data service for property requests
 */
export const propertyRequestService = {
  /**
   * Get all property requests for the current user
   */
  async getUserRequests() {
    // Get the access token
    const token = getAccessToken();
    if (!token) {
      throw new Error('User not authenticated');
    }
    
    // This would be replaced with a call to a backend API endpoint
    // For now, using a placeholder that would be implemented in the API
    try {
      const response = await fetch('/api/property-requests', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch property requests');
      }
      
      const data = await response.json();
      return data.requests || [];
    } catch (error) {
      console.error('Error fetching property requests:', error);
      throw error;
    }
  },
  
  /**
   * Get a property request by ID
   */
  async getRequestById(requestId) {
    // Get the access token
    const token = getAccessToken();
    if (!token) {
      throw new Error('User not authenticated');
    }
    
    try {
      const response = await fetch(`/api/property-requests/${requestId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch property request');
      }
      
      const data = await response.json();
      return data.request;
    } catch (error) {
      console.error('Error fetching property request:', error);
      throw error;
    }
  },
  
  /**
   * Create a new property request
   */
  async createRequest(requestData) {
    // Get the access token
    const token = getAccessToken();
    if (!token) {
      throw new Error('User not authenticated');
    }
    
    try {
      const response = await fetch('/api/property-requests', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to create property request');
      }
      
      const data = await response.json();
      return data.request;
    } catch (error) {
      console.error('Error creating property request:', error);
      throw error;
    }
  },
  
  /**
   * Update a property request
   */
  async updateRequest(requestId, requestData) {
    // Get the access token
    const token = getAccessToken();
    if (!token) {
      throw new Error('User not authenticated');
    }
    
    try {
      const response = await fetch(`/api/property-requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update property request');
      }
      
      const data = await response.json();
      return data.request;
    } catch (error) {
      console.error('Error updating property request:', error);
      throw error;
    }
  },
  
  /**
   * Delete a property request
   */
  async deleteRequest(requestId) {
    // Get the access token
    const token = getAccessToken();
    if (!token) {
      throw new Error('User not authenticated');
    }
    
    try {
      const response = await fetch(`/api/property-requests/${requestId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to delete property request');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting property request:', error);
      throw error;
    }
  },
  
  /**
   * Get property matches for a request
   */
  async getPropertyMatches(requestId) {
    // Get the access token
    const token = getAccessToken();
    if (!token) {
      throw new Error('User not authenticated');
    }
    
    try {
      const response = await fetch(`/api/property-requests/${requestId}/matches`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch property matches');
      }
      
      const data = await response.json();
      return data.properties || [];
    } catch (error) {
      console.error('Error fetching property matches:', error);
      throw error;
    }
  }
};

/**
 * Data service for properties
 */
export const propertyService = {
  /**
   * Get all properties
   */
  async getAllProperties() {
    try {
      return await propertyApi.getAllProperties();
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  },
  
  /**
   * Get a property by ID
   */
  async getPropertyById(propertyId) {
    try {
      return await propertyApi.getPropertyById(propertyId);
    } catch (error) {
      console.error('Error fetching property:', error);
      throw error;
    }
  },
  
  /**
   * Get property images
   */
  async getPropertyImages(propertyId) {
    try {
      return await propertyApi.getPropertyImages(propertyId);
    } catch (error) {
      console.error('Error fetching property images:', error);
      throw error;
    }
  }
};

/**
 * Data service for scheduled viewings
 */
export const viewingService = {
  /**
   * Get all scheduled viewings for the current user
   */
  async getUserViewings() {
    // Get the access token
    const token = getAccessToken();
    if (!token) {
      throw new Error('User not authenticated');
    }
    
    try {
      const response = await fetch('/api/scheduled-viewings', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch scheduled viewings');
      }
      
      const data = await response.json();
      return data.viewings || [];
    } catch (error) {
      console.error('Error fetching scheduled viewings:', error);
      throw error;
    }
  },
  
  /**
   * Schedule a new viewing
   */
  async scheduleViewing(viewingData) {
    // Get the access token
    const token = getAccessToken();
    if (!token) {
      throw new Error('User not authenticated');
    }
    
    try {
      const response = await fetch('/api/scheduled-viewings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(viewingData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to schedule viewing');
      }
      
      const data = await response.json();
      return data.viewing;
    } catch (error) {
      console.error('Error scheduling viewing:', error);
      throw error;
    }
  }
};

/**
 * Data service for user profiles and settings
 */
export const userService = {
  /**
   * Get the current user's profile
   */
  async getUserProfile() {
    // Get the access token
    const token = getAccessToken();
    if (!token) {
      throw new Error('User not authenticated');
    }
    
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch user profile');
      }
      
      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },
  
  /**
   * Update the current user's profile
   */
  async updateUserProfile(profileData) {
    // Get the access token
    const token = getAccessToken();
    if (!token) {
      throw new Error('User not authenticated');
    }
    
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update user profile');
      }
      
      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },
  
  /**
   * Get user notifications
   */
  async getUserNotifications() {
    // Get the access token
    const token = getAccessToken();
    if (!token) {
      throw new Error('User not authenticated');
    }
    
    try {
      const response = await fetch('/api/notifications', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch notifications');
      }
      
      const data = await response.json();
      return data.notifications || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },
  
  /**
   * Mark a notification as read
   */
  async markNotificationAsRead(notificationId) {
    // Get the access token
    const token = getAccessToken();
    if (!token) {
      throw new Error('User not authenticated');
    }
    
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to mark notification as read');
      }
      
      const data = await response.json();
      return data.notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }
};

/**
 * Data service for market insights
 */
import marketApi from './api/market';

export const insightService = {
  /**
   * Get market insights data
   */
  async getMarketInsights() {
    try {
      return await marketApi.getMarketInsights();
    } catch (error) {
      console.error('Error fetching market insights:', error);
      throw error;
    }
  }
};

// Helper function to get the access token
const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};