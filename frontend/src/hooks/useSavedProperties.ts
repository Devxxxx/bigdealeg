'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import savedPropertyApi from '@/lib/api/savedProperty';
import { toast } from 'react-hot-toast';

/**
 * Custom hook for managing saved properties
 * @param {string} propertyId - Optional property ID to check if saved
 * @returns {Object} - Saved properties data and functions
 */
export function useSavedProperties(propertyId = null) {
  const [savedProperties, setSavedProperties] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, session } = useAuth();

  // Fetch all saved properties
  const fetchSavedProperties = useCallback(async (options = {}) => {
    if (!user || !session?.access_token) {
      setSavedProperties([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await savedPropertyApi.getSavedProperties(session.access_token, options);
      setSavedProperties(result.data);
    } catch (err) {
      console.error('Error fetching saved properties:', err);
      setError(err.message || 'Failed to load saved properties');
      toast.error('Failed to load saved properties');
    } finally {
      setLoading(false);
    }
  }, [user, session]);

  // Check if a specific property is saved
  const checkIfPropertyIsSaved = useCallback(async () => {
    if (!propertyId || !user || !session?.access_token) {
      setIsSaved(false);
      return;
    }

    try {
      const result = await savedPropertyApi.isPropertySaved(session.access_token, propertyId);
      setIsSaved(result);
    } catch (err) {
      console.error('Error checking if property is saved:', err);
      setIsSaved(false);
    }
  }, [propertyId, user, session]);

  // Save a property
  const saveProperty = useCallback(async (id) => {
    if (!user || !session?.access_token) {
      toast.error('You must be logged in to save properties');
      return false;
    }

    const propId = id || propertyId;
    if (!propId) {
      toast.error('Property ID is required');
      return false;
    }

    try {
      await savedPropertyApi.saveProperty(session.access_token, propId);
      
      // Update state
      if (propertyId && propertyId === propId) {
        setIsSaved(true);
      }
      
      // Refetch the list if it's loaded
      if (savedProperties.length > 0) {
        fetchSavedProperties();
      }
      
      toast.success('Property saved successfully');
      return true;
    } catch (err) {
      console.error('Error saving property:', err);
      
      // Don't show error if it's just already saved
      if (err.message && err.message.includes('already saved')) {
        if (propertyId && propertyId === propId) {
          setIsSaved(true);
        }
        return true;
      }
      
      toast.error(err.message || 'Failed to save property');
      return false;
    }
  }, [user, session, propertyId, savedProperties.length, fetchSavedProperties]);

  // Unsave a property
  const unsaveProperty = useCallback(async (id) => {
    if (!user || !session?.access_token) {
      toast.error('You must be logged in to unsave properties');
      return false;
    }

    const propId = id || propertyId;
    if (!propId) {
      toast.error('Property ID is required');
      return false;
    }

    try {
      await savedPropertyApi.unsaveProperty(session.access_token, propId);
      
      // Update state
      if (propertyId && propertyId === propId) {
        setIsSaved(false);
      }
      
      // Update the list by removing this property
      setSavedProperties(prev => prev.filter(item => item.property_id !== propId));
      
      toast.success('Property removed from saved list');
      return true;
    } catch (err) {
      console.error('Error unsaving property:', err);
      
      // Don't show error if it's just not saved
      if (err.message && err.message.includes('not saved')) {
        if (propertyId && propertyId === propId) {
          setIsSaved(false);
        }
        return true;
      }
      
      toast.error(err.message || 'Failed to remove property from saved list');
      return false;
    }
  }, [user, session, propertyId]);

  // Toggle saved status
  const toggleSaved = useCallback(async (id) => {
    const propId = id || propertyId;
    if (!propId) return false;
    
    if (propertyId === propId) {
      return isSaved ? unsaveProperty(propId) : saveProperty(propId);
    } else {
      // Check first if we don't have the current status
      try {
        const saved = await savedPropertyApi.isPropertySaved(session?.access_token, propId);
        return saved ? unsaveProperty(propId) : saveProperty(propId);
      } catch (err) {
        console.error('Error toggling saved status:', err);
        return false;
      }
    }
  }, [isSaved, propertyId, saveProperty, session?.access_token, unsaveProperty]);

  // Clear all saved properties
  const clearAllSavedProperties = useCallback(async () => {
    if (!user || !session?.access_token) {
      toast.error('You must be logged in to clear saved properties');
      return false;
    }

    try {
      await savedPropertyApi.deleteAllSavedProperties(session.access_token);
      
      // Update state
      setSavedProperties([]);
      if (propertyId) {
        setIsSaved(false);
      }
      
      toast.success('All saved properties cleared');
      return true;
    } catch (err) {
      console.error('Error clearing saved properties:', err);
      toast.error(err.message || 'Failed to clear saved properties');
      return false;
    }
  }, [user, session, propertyId]);

  // Initial data fetch
  useEffect(() => {
    if (propertyId) {
      checkIfPropertyIsSaved();
    }
  }, [propertyId, checkIfPropertyIsSaved]);

  return {
    savedProperties,
    isSaved,
    loading,
    error,
    fetchSavedProperties,
    saveProperty,
    unsaveProperty,
    toggleSaved,
    clearAllSavedProperties
  };
}