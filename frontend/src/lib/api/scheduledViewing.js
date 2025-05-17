/**
 * Scheduled Viewings API client
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Get all scheduled viewings with optional filtering
 * @param {string} token - Access token
 * @param {Object} filters - Filter parameters
 * @returns {Promise<Object>} - List of scheduled viewings
 */
export const getScheduledViewings = async (token, filters = {}) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          queryParams.append(key, value.join(','));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    };

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

    const response = await fetch(`${API_URL}/scheduled-viewings?${queryParams.toString()}`, {
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
      throw new Error(errorData.error?.message || 'Failed to fetch scheduled viewings');
    }

    return await response.json();
  } catch (error) {
    console.error('Get scheduled viewings error:', error);
    throw error;
  }
};

/**
 * Get a scheduled viewing by ID
 * @param {string} token - Access token
 * @param {string} viewingId - Viewing ID
 * @returns {Promise<Object>} - Scheduled viewing details
 */
export const getScheduledViewingById = async (token, viewingId) => {
  try {
    const response = await fetch(`${API_URL}/scheduled-viewings/${viewingId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch scheduled viewing');
    }

    return await response.json();
  } catch (error) {
    console.error('Get scheduled viewing by ID error:', error);
    throw error;
  }
};

/**
 * Create a new scheduled viewing request
 * @param {string} token - Access token
 * @param {Object} viewingData - Basic viewing request data (property_id, notes)
 * @returns {Promise<Object>} - Created scheduled viewing
 */
export const createScheduledViewing = async (token, viewingData) => {
  try {
    const response = await fetch(`${API_URL}/scheduled-viewings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(viewingData),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to create scheduled viewing');
    }

    return await response.json();
  } catch (error) {
    console.error('Create scheduled viewing error:', error);
    throw error;
  }
};

/**
 * Update a scheduled viewing
 * @param {string} token - Access token
 * @param {string} viewingId - Viewing ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} - Updated scheduled viewing
 */
export const updateScheduledViewing = async (token, viewingId, updateData) => {
  try {
    const response = await fetch(`${API_URL}/scheduled-viewings/${viewingId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to update scheduled viewing');
    }

    return await response.json();
  } catch (error) {
    console.error('Update scheduled viewing error:', error);
    throw error;
  }
};

/**
 * Delete a scheduled viewing
 * @param {string} token - Access token
 * @param {string} viewingId - Viewing ID
 * @returns {Promise<Object>} - Response with success message
 */
export const deleteScheduledViewing = async (token, viewingId) => {
  try {
    const response = await fetch(`${API_URL}/scheduled-viewings/${viewingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to delete scheduled viewing');
    }

    return await response.json();
  } catch (error) {
    console.error('Delete scheduled viewing error:', error);
    throw error;
  }
};

/**
 * Cancel a scheduled viewing
 * @param {string} token - Access token
 * @param {string} viewingId - Viewing ID
 * @param {Object} cancelData - Cancellation data
 * @returns {Promise<Object>} - Updated scheduled viewing
 */
export const cancelScheduledViewing = async (token, viewingId, cancelData = {}) => {
  try {
    const response = await fetch(`${API_URL}/scheduled-viewings/${viewingId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cancelData),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to cancel scheduled viewing');
    }

    return await response.json();
  } catch (error) {
    console.error('Cancel scheduled viewing error:', error);
    throw error;
  }
};

/**
 * Confirm a scheduled viewing (for sales ops and admin only)
 * @param {string} token - Access token
 * @param {string} viewingId - Viewing ID
 * @param {Object} confirmData - Confirmation data
 * @returns {Promise<Object>} - Updated scheduled viewing
 */
export const confirmScheduledViewing = async (token, viewingId, confirmData) => {
  try {
    const response = await fetch(`${API_URL}/scheduled-viewings/${viewingId}/confirm`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(confirmData),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to confirm scheduled viewing');
    }

    return await response.json();
  } catch (error) {
    console.error('Confirm scheduled viewing error:', error);
    throw error;
  }
};

/**
 * Complete a scheduled viewing (for sales ops and admin only)
 * @param {string} token - Access token
 * @param {string} viewingId - Viewing ID
 * @param {Object} completeData - Completion data
 * @returns {Promise<Object>} - Updated scheduled viewing
 */
export const completeScheduledViewing = async (token, viewingId, completeData = {}) => {
  try {
    const response = await fetch(`${API_URL}/scheduled-viewings/${viewingId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(completeData),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to complete scheduled viewing');
    }

    return await response.json();
  } catch (error) {
    console.error('Complete scheduled viewing error:', error);
    throw error;
  }
};

/**
 * Propose viewing slots (for sales ops and admin)
 * @param {string} token - Access token
 * @param {string} viewingId - Viewing ID
 * @param {Object} proposalData - Data with proposed slots
 * @returns {Promise<Object>} - Updated scheduled viewing
 */
export const proposeViewingSlots = async (token, viewingId, proposalData) => {
  try {
    const response = await fetch(`${API_URL}/scheduled-viewings/${viewingId}/propose-slots`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(proposalData),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to propose viewing slots');
    }

    return await response.json();
  } catch (error) {
    console.error('Propose viewing slots error:', error);
    throw error;
  }
};

/**
 * Select a viewing slot (for customers)
 * @param {string} token - Access token
 * @param {string} viewingId - Viewing ID
 * @param {Object} selectionData - Customer's slot selection
 * @returns {Promise<Object>} - Updated scheduled viewing
 */
export const selectViewingSlot = async (token, viewingId, selectionData) => {
  try {
    const response = await fetch(`${API_URL}/scheduled-viewings/${viewingId}/select-slot`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectionData),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to select viewing slot');
    }

    return await response.json();
  } catch (error) {
    console.error('Select viewing slot error:', error);
    throw error;
  }
};

export default {
  getScheduledViewings,
  getScheduledViewingById,
  createScheduledViewing,
  updateScheduledViewing,
  deleteScheduledViewing,
  cancelScheduledViewing,
  confirmScheduledViewing,
  completeScheduledViewing,
  proposeViewingSlots,
  selectViewingSlot
};