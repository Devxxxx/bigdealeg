/**
 * Property Request API client
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Get all property requests
 * @param {string} token - Access token
 * @param {Object} filters - Filter parameters
 * @returns {Promise<Object>} - Property requests with pagination info
 */
export const getPropertyRequests = async (token, filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add all filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    // Only add viewAll if not already in filters
    // For customer users, we should NOT force viewAll=true as it won't work
    if (!queryParams.has('viewAll') && filters.role !== 'customer') {
      queryParams.append('viewAll', 'true');
    } else if (!queryParams.has('viewAll')) {
      // For customers, explicitly set viewAll=false
      queryParams.append('viewAll', 'false');
    }

    // Add a cache-busting timestamp to prevent 304 responses
    queryParams.append('_t', Date.now());

    const response = await fetch(`${API_URL}/property-requests?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        // Prevent caching to avoid 304 responses
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch property requests');
    }

    return await response.json();
  } catch (error) {
    console.error('Get property requests error:', error);
    throw error;
  }
};

/**
 * Get a property request by ID
 * @param {string} token - Access token
 * @param {string} requestId - Request ID
 * @returns {Promise<Object>} - Property request
 */
export const getPropertyRequestById = async (token, requestId) => {
  try {
    if (!requestId) {
      throw new Error('Request ID is required');
    }

    const response = await fetch(`${API_URL}/property-requests/${requestId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch property request');
    }

    return await response.json();
  } catch (error) {
    console.error('Get property request error:', error);
    throw error;
  }
};

/**
 * Create a property request
 * @param {string} token - Access token
 * @param {Object} requestData - Property request data
 * @returns {Promise<Object>} - Created property request
 */
export const createPropertyRequest = async (token, requestData) => {
  try {
    const response = await fetch(`${API_URL}/property-requests`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to create property request');
    }

    return await response.json();
  } catch (error) {
    console.error('Create property request error:', error);
    throw error;
  }
};

/**
 * Update a property request
 * @param {string} token - Access token
 * @param {string} requestId - Request ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} - Updated property request
 */
export const updatePropertyRequest = async (token, requestId, updateData) => {
  try {
    if (!requestId) {
      throw new Error('Request ID is required');
    }

    const response = await fetch(`${API_URL}/property-requests/${requestId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to update property request');
    }

    return await response.json();
  } catch (error) {
    console.error('Update property request error:', error);
    throw error;
  }
};

/**
 * Delete a property request
 * @param {string} token - Access token
 * @param {string} requestId - Request ID
 * @returns {Promise<Object>} - Success message
 */
export const deletePropertyRequest = async (token, requestId) => {
  try {
    if (!requestId) {
      throw new Error('Request ID is required');
    }

    const response = await fetch(`${API_URL}/property-requests/${requestId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to delete property request');
    }

    return await response.json();
  } catch (error) {
    console.error('Delete property request error:', error);
    throw error;
  }
};

/**
 * Get all property request fields
 * @param {string} token - Access token
 * @returns {Promise<Array>} - List of property request fields
 */
export const getPropertyRequestFields = async (token) => {
  try {
    const timestamp = Date.now();
    const response = await fetch(`${API_URL}/property-requests/fields?_t=${timestamp}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch property request fields');
    }

    return await response.json();
  } catch (error) {
    console.error('Get property request fields error:', error);
    throw error;
  }
};

/**
 * Assign a property request to a sales operator
 * @param {string} token - Access token
 * @param {string} requestId - Request ID
 * @param {string} salesOpId - Sales operator ID
 * @param {string} notes - Assignment notes
 * @returns {Promise<Object>} - Updated property request
 */
export const assignPropertyRequest = async (token, requestId, salesOpId, notes = '') => {
  try {
    if (!requestId) {
      throw new Error('Request ID is required');
    }

    if (!salesOpId) {
      throw new Error('Sales operator ID is required');
    }

    const response = await fetch(`${API_URL}/property-requests/${requestId}/assign`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ salesOpId, notes })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to assign property request');
    }

    return await response.json();
  } catch (error) {
    console.error('Assign property request error:', error);
    throw error;
  }
};

/**
 * Add a status update to a property request
 * @param {string} token - Access token
 * @param {string} requestId - Request ID
 * @param {Object} statusData - Status update data
 * @returns {Promise<Object>} - Updated property request with status history
 */
export const addStatusUpdate = async (token, requestId, statusData) => {
  try {
    if (!requestId) {
      throw new Error('Request ID is required');
    }

    if (!statusData.status) {
      throw new Error('Status is required');
    }

    const response = await fetch(`${API_URL}/property-requests/${requestId}/status`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(statusData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to update property request status');
    }

    return await response.json();
  } catch (error) {
    console.error('Add status update error:', error);
    throw error;
  }
};

export default {
  getPropertyRequests,
  getPropertyRequestById,
  createPropertyRequest,
  updatePropertyRequest,
  deletePropertyRequest,
  getPropertyRequestFields,
  assignPropertyRequest,
  addStatusUpdate
};