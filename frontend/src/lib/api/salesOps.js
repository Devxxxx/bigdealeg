/**
 * Sales Ops API client
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Get dashboard data
 * @param {string} token - Access token
 * @returns {Promise<Object>} - Dashboard data
 */
export const getDashboardData = async (token) => {
  try {
    const response = await fetch(`${API_URL}/sales-ops/dashboard`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch dashboard data');
    }

    return await response.json();
  } catch (error) {
    console.error('Get dashboard data error:', error);
    throw error;
  }
};

/**
 * Get properties with filtering, sorting, and pagination
 * @param {string} token - Access token
 * @param {Object} options - Filter and pagination options
 * @returns {Promise<Object>} - Properties data
 */
export const getProperties = async (token, options = {}) => {
  try {
    // Build query string from options
    const queryParams = new URLSearchParams();
    
    for (const [key, value] of Object.entries(options)) {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    }

    const response = await fetch(`${API_URL}/sales-ops/properties?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch properties');
    }

    return await response.json();
  } catch (error) {
    console.error('Get properties error:', error);
    throw error;
  }
};

/**
 * Toggle property availability
 * @param {string} token - Access token
 * @param {string} propertyId - Property ID
 * @param {boolean} currentStatus - Current availability status
 * @returns {Promise<Object>} - Updated property
 */
export const togglePropertyAvailability = async (token, propertyId, currentStatus) => {
  try {
    const response = await fetch(`${API_URL}/sales-ops/properties/${propertyId}/toggle-availability`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentStatus }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to toggle property availability');
    }

    return await response.json();
  } catch (error) {
    console.error('Toggle property availability error:', error);
    throw error;
  }
};

/**
 * Create a new property
 * @param {string} token - Access token
 * @param {Object} propertyData - Property data
 * @returns {Promise<Object>} - Created property
 */
export const createProperty = async (token, propertyData) => {
  try {
    const response = await fetch(`${API_URL}/sales-ops/properties`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(propertyData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to create property');
    }

    return await response.json();
  } catch (error) {
    console.error('Create property error:', error);
    throw error;
  }
};

/**
 * Delete property
 * @param {string} token - Access token
 * @param {string} propertyId - Property ID
 * @returns {Promise<Object>} - Success message
 */
export const deleteProperty = async (token, propertyId) => {
  try {
    const response = await fetch(`${API_URL}/sales-ops/properties/${propertyId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to delete property');
    }

    return await response.json();
  } catch (error) {
    console.error('Delete property error:', error);
    throw error;
  }
};

/**
 * Get property requests with filtering, sorting, and pagination
 * @param {string} token - Access token
 * @param {Object} options - Filter and pagination options
 * @returns {Promise<Object>} - Property requests data
 */
export const getPropertyRequests = async (token, options = {}) => {
  try {
    // Build query string from options
    const queryParams = new URLSearchParams();
    
    for (const [key, value] of Object.entries(options)) {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    }

    const response = await fetch(`${API_URL}/sales-ops/property-requests?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
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
 * Get property request by ID
 * @param {string} token - Access token
 * @param {string} requestId - Request ID
 * @returns {Promise<Object>} - Property request data
 */
export const getPropertyRequestById = async (token, requestId) => {
  try {
    const response = await fetch(`${API_URL}/sales-ops/property-requests/${requestId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
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
 * Update property request status
 * @param {string} token - Access token
 * @param {string} requestId - Request ID
 * @param {string} status - New status
 * @returns {Promise<Object>} - Updated property request
 */
export const updatePropertyRequestStatus = async (token, requestId, status) => {
  try {
    const response = await fetch(`${API_URL}/sales-ops/property-requests/${requestId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to update property request status');
    }

    return await response.json();
  } catch (error) {
    console.error('Update property request status error:', error);
    throw error;
  }
};

/**
 * Get scheduled viewings with filtering, sorting, and pagination
 * @param {string} token - Access token
 * @param {Object} options - Filter and pagination options
 * @returns {Promise<Object>} - Scheduled viewings data
 */
export const getScheduledViewings = async (token, options = {}) => {
  try {
    // Build query string from options
    const queryParams = new URLSearchParams();
    
    for (const [key, value] of Object.entries(options)) {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    }

    const response = await fetch(`${API_URL}/sales-ops/scheduled-viewings?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch scheduled viewings');
    }

    return await response.json();
  } catch (error) {
    console.error('Get scheduled viewings error:', error);
    throw error;
  }
};

/**
 * Get scheduled viewing by ID
 * @param {string} token - Access token
 * @param {string} viewingId - Viewing ID
 * @returns {Promise<Object>} - Scheduled viewing data
 */
export const getScheduledViewingById = async (token, viewingId) => {
  try {
    const response = await fetch(`${API_URL}/sales-ops/scheduled-viewings/${viewingId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch scheduled viewing');
    }

    return await response.json();
  } catch (error) {
    console.error('Get scheduled viewing error:', error);
    throw error;
  }
};

export default {
  getDashboardData,
  getProperties,
  createProperty,
  togglePropertyAvailability,
  deleteProperty,
  getPropertyRequests,
  getPropertyRequestById,
  updatePropertyRequestStatus,
  getScheduledViewings,
  getScheduledViewingById,
};