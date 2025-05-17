/**
 * Admin API client
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Get dashboard data including stats, activities, and alerts
 * @param {string} token - Access token
 * @returns {Promise<Object>} - Dashboard data
 */
export const getDashboardData = async (token) => {
  try {
    const response = await fetch(`${API_URL}/admin/dashboard`, {
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
 * Get users with filtering, pagination, and sorting
 * @param {string} token - Access token
 * @param {Object} options - Filter and pagination options
 * @returns {Promise<Object>} - Users data
 */
export const getUsers = async (token, options = {}) => {
  try {
    // Build query string from options
    const queryParams = new URLSearchParams();
    
    for (const [key, value] of Object.entries(options)) {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    }

    const response = await fetch(`${API_URL}/admin/users?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch users');
    }

    return await response.json();
  } catch (error) {
    console.error('Get users error:', error);
    throw error;
  }
};

/**
 * Get user details by ID
 * @param {string} token - Access token
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - User details
 */
export const getUserById = async (token, userId) => {
  try {
    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch user details');
    }

    return await response.json();
  } catch (error) {
    console.error('Get user details error:', error);
    throw error;
  }
};

/**
 * Update user role
 * @param {string} token - Access token
 * @param {string} userId - User ID
 * @param {string} role - New role
 * @returns {Promise<Object>} - Updated user
 */
export const updateUserRole = async (token, userId, role) => {
  try {
    const response = await fetch(`${API_URL}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to update user role');
    }

    return await response.json();
  } catch (error) {
    console.error('Update user role error:', error);
    throw error;
  }
};

/**
 * Toggle user active status
 * @param {string} token - Access token
 * @param {string} userId - User ID
 * @param {boolean} isActive - New active status
 * @returns {Promise<Object>} - Updated user
 */
export const toggleUserStatus = async (token, userId, isActive) => {
  try {
    const response = await fetch(`${API_URL}/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_active: isActive }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to update user status');
    }

    return await response.json();
  } catch (error) {
    console.error('Toggle user status error:', error);
    throw error;
  }
};

/**
 * Delete a user
 * @param {string} token - Access token
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export const deleteUser = async (token, userId) => {
  try {
    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to delete user');
    }

    return await response.json();
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
  }
};

/**
 * Get form fields
 * @param {string} token - Access token
 * @returns {Promise<Object[]>} - Form fields
 */
export const getFormFields = async (token) => {
  try {
    const response = await fetch(`${API_URL}/admin/form-fields`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch form fields');
    }

    const data = await response.json();
    return data.fields || [];
  } catch (error) {
    console.error('Get form fields error:', error);
    throw error;
  }
};

/**
 * Create a new form field
 * @param {string} token - Access token
 * @param {Object} fieldData - Field data
 * @returns {Promise<Object>} - Created field
 */
export const createFormField = async (token, fieldData) => {
  try {
    const response = await fetch(`${API_URL}/admin/form-fields`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fieldData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to create form field');
    }

    const data = await response.json();
    return data.field;
  } catch (error) {
    console.error('Create form field error:', error);
    throw error;
  }
};

/**
 * Update an existing form field
 * @param {string} token - Access token
 * @param {string} fieldId - Field ID
 * @param {Object} fieldData - Updated field data
 * @returns {Promise<Object>} - Updated field
 */
export const updateFormField = async (token, fieldId, fieldData) => {
  try {
    const response = await fetch(`${API_URL}/admin/form-fields/${fieldId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fieldData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to update form field');
    }

    const data = await response.json();
    return data.field;
  } catch (error) {
    console.error('Update form field error:', error);
    throw error;
  }
};

/**
 * Delete a form field
 * @param {string} token - Access token
 * @param {string} fieldId - Field ID
 * @returns {Promise<void>}
 */
export const deleteFormField = async (token, fieldId) => {
  try {
    const response = await fetch(`${API_URL}/admin/form-fields/${fieldId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to delete form field');
    }

    return await response.json();
  } catch (error) {
    console.error('Delete form field error:', error);
    throw error;
  }
};

/**
 * Toggle a field's required status
 * @param {string} token - Access token
 * @param {string} fieldId - Field ID
 * @param {boolean} required - New required status
 * @returns {Promise<Object>} - Updated field
 */
export const toggleFieldRequired = async (token, fieldId, required) => {
  try {
    const response = await fetch(`${API_URL}/admin/form-fields/${fieldId}/required`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ required }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to toggle field required status');
    }

    const data = await response.json();
    return data.field;
  } catch (error) {
    console.error('Toggle field required error:', error);
    throw error;
  }
};

/**
 * Update a field's order
 * @param {string} token - Access token
 * @param {string} fieldId - Field ID
 * @param {number} currentOrder - Current order
 * @param {number} targetOrder - Target order
 * @returns {Promise<void>}
 */
export const updateFieldOrder = async (token, fieldId, currentOrder, targetOrder) => {
  try {
    // Ensure orders are numbers
    const currentOrderNum = parseInt(currentOrder, 10);
    const targetOrderNum = parseInt(targetOrder, 10);
    
    if (isNaN(currentOrderNum) || isNaN(targetOrderNum)) {
      throw new Error('Invalid order values');
    }
    
    const response = await fetch(`${API_URL}/admin/form-fields/${fieldId}/order`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ order: currentOrderNum, targetOrder: targetOrderNum }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to update field order');
    }

    return await response.json();
  } catch (error) {
    console.error('Update field order error:', error);
    throw error;
  }
};

/**
 * Get system settings
 * @param {string} token - Access token
 * @returns {Promise<Object>} - System settings
 */
export const getSettings = async (token) => {
  try {
    const response = await fetch(`${API_URL}/admin/settings`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch settings');
    }

    const data = await response.json();
    return data.settings;
  } catch (error) {
    console.error('Get settings error:', error);
    throw error;
  }
};

/**
 * Update system settings
 * @param {string} token - Access token
 * @param {Object} settingsData - Settings data
 * @returns {Promise<Object>} - Updated settings
 */
export const updateSettings = async (token, settingsData) => {
  try {
    const response = await fetch(`${API_URL}/admin/settings`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settingsData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to update settings');
    }

    const data = await response.json();
    return data.settings;
  } catch (error) {
    console.error('Update settings error:', error);
    throw error;
  }
};

/**
 * Reset system settings to default
 * @param {string} token - Access token
 * @returns {Promise<Object>} - Default settings
 */
export const resetSettings = async (token) => {
  try {
    const response = await fetch(`${API_URL}/admin/settings/reset`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to reset settings');
    }

    const data = await response.json();
    return data.settings;
  } catch (error) {
    console.error('Reset settings error:', error);
    throw error;
  }
};

export default {
  getDashboardData,
  getUsers,
  getUserById,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  getFormFields,
  createFormField,
  updateFormField,
  deleteFormField,
  toggleFieldRequired,
  updateFieldOrder,
  getSettings,
  updateSettings,
  resetSettings,
};