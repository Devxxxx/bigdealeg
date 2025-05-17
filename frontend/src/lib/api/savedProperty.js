/**
 * Saved Properties API client
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Get saved properties for the authenticated user
 * @param {string} token - Access token
 * @param {Object} options - Options for fetching
 * @param {number} options.page - Page number
 * @param {number} options.limit - Items per page
 * @returns {Promise<Object>} - Saved properties and count
 */
export const getSavedProperties = async (token, options = {}) => {
  try {
    let url = `${API_URL}/saved-properties`;
    
    // Add query parameters if provided
    const queryParams = new URLSearchParams();
    if (options.page) queryParams.append('page', options.page);
    if (options.limit) queryParams.append('limit', options.limit);
    
    // Add cache-busting timestamp
    queryParams.append('_t', Date.now());
    
    url += `?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      },
      credentials: 'include', // Include cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch saved properties');
    }

    return await response.json();
  } catch (error) {
    console.error('Get saved properties error:', error);
    throw error;
  }
};

/**
 * Check if a property is saved by the authenticated user
 * @param {string} token - Access token
 * @param {string} propertyId - Property ID
 * @returns {Promise<boolean>} - True if property is saved
 */
export const isPropertySaved = async (token, propertyId) => {
  try {
    const response = await fetch(`${API_URL}/saved-properties/check/${propertyId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include', // Include cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to check if property is saved');
    }

    const data = await response.json();
    return data.isSaved;
  } catch (error) {
    console.error('Check if property is saved error:', error);
    return false; // Default to not saved in case of error
  }
};

/**
 * Save a property for the authenticated user
 * @param {string} token - Access token
 * @param {string} propertyId - Property ID
 * @returns {Promise<Object>} - Saved property
 */
export const saveProperty = async (token, propertyId) => {
  try {
    const response = await fetch(`${API_URL}/saved-properties/${propertyId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to save property');
    }

    return await response.json();
  } catch (error) {
    console.error('Save property error:', error);
    throw error;
  }
};

/**
 * Unsave a property for the authenticated user
 * @param {string} token - Access token
 * @param {string} propertyId - Property ID
 * @returns {Promise<Object>} - Success message
 */
export const unsaveProperty = async (token, propertyId) => {
  try {
    const response = await fetch(`${API_URL}/saved-properties/${propertyId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include', // Include cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to unsave property');
    }

    return await response.json();
  } catch (error) {
    console.error('Unsave property error:', error);
    throw error;
  }
};

/**
 * Delete all saved properties for the authenticated user
 * @param {string} token - Access token
 * @returns {Promise<Object>} - Success message
 */
export const deleteAllSavedProperties = async (token) => {
  try {
    const response = await fetch(`${API_URL}/saved-properties`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include', // Include cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to delete all saved properties');
    }

    return await response.json();
  } catch (error) {
    console.error('Delete all saved properties error:', error);
    throw error;
  }
};

export default {
  getSavedProperties,
  isPropertySaved,
  saveProperty,
  unsaveProperty,
  deleteAllSavedProperties,
};