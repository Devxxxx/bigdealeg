'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import propertyRequestApi from '@/lib/api/propertyRequest';

/**
 * Custom hook for managing property requests
 * @param {Object} options - Options for the hook
 * @param {Object} options.filters - Initial filters for property requests
 * @param {boolean} options.loadOnMount - Whether to load requests on mount
 * @returns {Object} - Property requests data and actions
 */
export function usePropertyRequests(options = {}) {
  const [requests, setRequests] = useState([]);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(options.filters || {});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalCount: 0
  });
  const [fields, setFields] = useState([]);
  const { user, session } = useAuth();

  /**
   * Fetch property requests based on filters
   */
  const fetchRequests = useCallback(async () => {
    if (!user || !session?.access_token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await propertyRequestApi.getPropertyRequests(session.access_token, {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
        role: user?.role // Include the user's role in the request
      });
      
      console.log('Property requests result:', result);
      setRequests(result.requests || []);
      setPagination({
        ...pagination,
        totalPages: result.totalPages || 1,
        totalCount: result.totalCount || 0
      });
    } catch (err) {
      console.error('Error fetching property requests:', err);
      setError(err.message || 'Failed to fetch property requests');
    } finally {
      setLoading(false);
    }
  }, [user, session, filters, pagination.page, pagination.limit]);

  /**
   * Fetch a single property request by ID
   * @param {string} requestId - Request ID
   */
  const fetchRequestById = useCallback(async (requestId) => {
    if (!user || !session?.access_token || !requestId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await propertyRequestApi.getPropertyRequestById(session.access_token, requestId);
      setCurrentRequest(result);
      return result;
    } catch (err) {
      console.error('Error fetching property request:', err);
      setError(err.message || 'Failed to fetch property request');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, session]);

  /**
   * Create a new property request
   * @param {Object} requestData - Property request data
   */
  const createRequest = useCallback(async (requestData) => {
    if (!user || !session?.access_token) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await propertyRequestApi.createPropertyRequest(session.access_token, requestData);
      // Don't update state since we might not be on the list page
      return result;
    } catch (err) {
      console.error('Error creating property request:', err);
      setError(err.message || 'Failed to create property request');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, session]);

  /**
   * Update an existing property request
   * @param {string} requestId - Request ID
   * @param {Object} updateData - Data to update
   */
  const updateRequest = useCallback(async (requestId, updateData) => {
    if (!user || !session?.access_token || !requestId) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await propertyRequestApi.updatePropertyRequest(session.access_token, requestId, updateData);
      
      // Update current request if we're viewing it
      if (currentRequest && currentRequest.id === requestId) {
        setCurrentRequest(result);
      }
      
      // Update in the requests list if present
      setRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, ...result } : req
      ));
      
      return result;
    } catch (err) {
      console.error('Error updating property request:', err);
      setError(err.message || 'Failed to update property request');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, session, currentRequest]);

  /**
   * Delete a property request
   * @param {string} requestId - Request ID
   */
  const deleteRequest = useCallback(async (requestId) => {
    if (!user || !session?.access_token || !requestId) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      await propertyRequestApi.deletePropertyRequest(session.access_token, requestId);
      
      // Remove from requests list
      setRequests(prev => prev.filter(req => req.id !== requestId));
      
      // Clear current request if it's the one deleted
      if (currentRequest && currentRequest.id === requestId) {
        setCurrentRequest(null);
      }
      
      return true;
    } catch (err) {
      console.error('Error deleting property request:', err);
      setError(err.message || 'Failed to delete property request');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, session, currentRequest]);

  /**
   * Fetch property request fields
   */
  const fetchFields = useCallback(async () => {
    if (!user || !session?.access_token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await propertyRequestApi.getPropertyRequestFields(session.access_token);
      setFields(result || []);
      return result;
    } catch (err) {
      console.error('Error fetching property request fields:', err);
      setError(err.message || 'Failed to fetch property request fields');
      return [];
    } finally {
      setLoading(false);
    }
  }, [user, session]);

  /**
   * Assign a property request to a sales operator
   * @param {string} requestId - Request ID
   * @param {string} salesOpId - Sales operator ID
   * @param {string} notes - Assignment notes
   */
  const assignRequest = useCallback(async (requestId, salesOpId, notes = '') => {
    if (!user || !session?.access_token || !requestId || !salesOpId) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await propertyRequestApi.assignPropertyRequest(
        session.access_token, 
        requestId, 
        salesOpId, 
        notes
      );
      
      // Update current request if we're viewing it
      if (currentRequest && currentRequest.id === requestId) {
        setCurrentRequest({
          ...currentRequest,
          assigned_to: salesOpId,
          assigned_to_profile: result.assigned_to_profile
        });
      }
      
      // Update in the requests list if present
      setRequests(prev => prev.map(req => 
        req.id === requestId ? { 
          ...req, 
          assigned_to: salesOpId,
          assigned_to_profile: result.assigned_to_profile
        } : req
      ));
      
      return result;
    } catch (err) {
      console.error('Error assigning property request:', err);
      setError(err.message || 'Failed to assign property request');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, session, currentRequest]);

  /**
   * Add a status update to a property request
   * @param {string} requestId - Request ID
   * @param {Object} statusData - Status update data
   */
  const addStatusUpdate = useCallback(async (requestId, statusData) => {
    if (!user || !session?.access_token || !requestId || !statusData.status) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await propertyRequestApi.addStatusUpdate(
        session.access_token, 
        requestId, 
        statusData
      );
      
      // Update current request if we're viewing it
      if (currentRequest && currentRequest.id === requestId) {
        setCurrentRequest({
          ...currentRequest,
          status: statusData.status,
          status_history: [
            result.history,
            ...(currentRequest.status_history || [])
          ]
        });
      }
      
      // Update in the requests list if present
      setRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: statusData.status } : req
      ));
      
      return result;
    } catch (err) {
      console.error('Error updating property request status:', err);
      setError(err.message || 'Failed to update property request status');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, session, currentRequest]);

  /**
   * Update filters and reset pagination
   * @param {Object} newFilters - New filters
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
    // Reset pagination when changing filters
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  }, []);

  /**
   * Update pagination
   * @param {Object} newPagination - New pagination
   */
  const updatePagination = useCallback((newPagination) => {
    setPagination(prev => ({
      ...prev,
      ...newPagination
    }));
  }, []);

  // Load requests on mount if requested
  useEffect(() => {
    if (options.loadOnMount) {
      fetchRequests();
    }
  }, [options.loadOnMount, fetchRequests]);

  // Load fields on mount
  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  return {
    requests,
    currentRequest,
    loading,
    error,
    filters,
    pagination,
    fields,
    fetchRequests,
    fetchRequestById,
    createRequest,
    updateRequest,
    deleteRequest,
    fetchFields,
    assignRequest,
    addStatusUpdate,
    updateFilters,
    updatePagination,
    setCurrentRequest
  };
}