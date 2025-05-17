/**
 * Property API client
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Get all properties
 * @returns {Promise<Object[]>} - Properties array
 */
export const getAllProperties = async () => {
  try {
    const response = await fetch(`${API_URL}/properties`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch properties');
    }

    const data = await response.json();
    return data.properties || [];
  } catch (error) {
    console.error('Get properties error:', error);
    throw error;
  }
};

/**
 * Get property by ID
 * @param {string} propertyId - Property ID
 * @returns {Promise<Object>} - Property data
 */
export const getPropertyById = async (propertyId) => {
  try {
    const response = await fetch(`${API_URL}/properties/${propertyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch property');
    }

    const data = await response.json();
    return data.property;
  } catch (error) {
    console.error('Get property error:', error);
    throw error;
  }
};

/**
 * Get similar properties
 * @param {string} propertyId - Property ID
 * @param {number} limit - Maximum number of properties to return
 * @returns {Promise<Object[]>} - Similar properties array
 */
export const getSimilarProperties = async (propertyId, limit = 3) => {
  try {
    const response = await fetch(`${API_URL}/properties/${propertyId}/similar?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch similar properties');
    }

    const data = await response.json();
    return data.properties || [];
  } catch (error) {
    console.error('Get similar properties error:', error);
    throw error;
  }
};

/**
 * Increment property views
 * @param {string} propertyId - Property ID
 * @param {string} token - Access token
 * @returns {Promise<void>}
 */
export const incrementPropertyViews = async (propertyId, token) => {
  try {
    const response = await fetch(`${API_URL}/properties/${propertyId}/increment-views`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to increment property views');
    }
  } catch (error) {
    console.error('Increment property views error:', error);
    throw error;
  }
};

/**
 * Get property images
 * @param {string} propertyId - Property ID
 * @param {string} type - Image type (property, master_plan, compound)
 * @returns {Promise<Object[]>} - Property images
 */
export const getPropertyImages = async (propertyId, type = null) => {
  try {
    let url = `${API_URL}/properties/${propertyId}/images`;
    if (type) {
      url += `?type=${type}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch property images');
    }

    const data = await response.json();
    return data.images || [];
  } catch (error) {
    console.error('Get property images error:', error);
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
    // Log the request for debugging
    console.log('Creating property with data:', propertyData);
    
    const response = await fetch(`${API_URL}/properties`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(propertyData),
    });

    // Check for non-200 responses
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage;
      
      try {
        // Try to parse as JSON
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || 'Failed to create property';
      } catch (e) {
        // If not JSON, use the raw text
        errorMessage = errorText || `Failed with status ${response.status}`;
      }
      
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('Create property error:', error);
    throw error;
  }
};

/**
 * Upload property images
 * @param {string} token - Access token
 * @param {string} propertyId - Property ID
 * @param {Array} images - Array of image objects with url and type
 * @returns {Promise<Object>} - Uploaded images info
 */
export const uploadPropertyImages = async (token, propertyId, images) => {
  try {
    const response = await fetch(`${API_URL}/properties/${propertyId}/images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ images }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to upload property images');
    }

    return await response.json();
  } catch (error) {
    console.error('Upload property images error:', error);
    throw error;
  }
};

/**
 * Delete property image
 * @param {string} token - Access token
 * @param {string} imageId - Image ID
 * @returns {Promise<Object>} - Success message
 */
export const deletePropertyImage = async (token, imageId) => {
  try {
    const response = await fetch(`${API_URL}/properties/images/${imageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to delete property image');
    }

    return await response.json();
  } catch (error) {
    console.error('Delete property image error:', error);
    throw error;
  }
};

/**
 * Update property
 * @param {string} token - Access token
 * @param {string} propertyId - Property ID
 * @param {Object} propertyData - Property data to update
 * @returns {Promise<Object>} - Updated property
 */
export const updateProperty = async (token, propertyId, propertyData) => {
  try {
    const response = await fetch(`${API_URL}/properties/${propertyId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(propertyData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to update property');
    }

    return await response.json();
  } catch (error) {
    console.error('Update property error:', error);
    throw error;
  }
};

/**
 * Handle image upload to storage service
 * @param {string} token - Access token
 * @param {File} file - Image file
 * @param {Function} progressCallback - Callback for upload progress
 * @returns {Promise<string>} - Uploaded image URL
 */
export const uploadImage = async (token, file, progressCallback = () => {}) => {
  try {
    // Create form data
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`${API_URL}/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
      // Track upload progress
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        progressCallback(percentCompleted);
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Upload image error:', error);
    throw error;
  }
};

export default {
  getAllProperties,
  getPropertyById,
  getSimilarProperties,
  incrementPropertyViews,
  getPropertyImages,
  createProperty,
  uploadPropertyImages,
  deletePropertyImage,
  updateProperty,
  uploadImage
};