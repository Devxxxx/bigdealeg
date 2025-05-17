/**
 * Settings API client
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Get user settings
 * @param {string} token - Access token
 * @returns {Promise<Object>} - User settings
 */
export const getUserSettings = async (token) => {
  try {
    const response = await fetch(`${API_URL}/settings`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include', // Include cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch user settings');
    }

    return await response.json();
  } catch (error) {
    console.error('Get user settings error:', error);
    throw error;
  }
};

/**
 * Update user profile
 * @param {string} token - Access token
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<Object>} - Updated profile
 */
export const updateUserProfile = async (token, profileData) => {
  try {
    const response = await fetch(`${API_URL}/settings/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
      credentials: 'include', // Include cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to update user profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Update user profile error:', error);
    throw error;
  }
};

/**
 * Update notification settings
 * @param {string} token - Access token
 * @param {Object} notificationData - Notification settings to update
 * @returns {Promise<Object>} - Updated notification settings
 */
export const updateNotificationSettings = async (token, notificationData) => {
  try {
    const response = await fetch(`${API_URL}/settings/notifications`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notificationData),
      credentials: 'include', // Include cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to update notification settings');
    }

    return await response.json();
  } catch (error) {
    console.error('Update notification settings error:', error);
    throw error;
  }
};

/**
 * Update user password
 * @param {string} token - Access token
 * @param {Object} passwordData - Password data
 * @returns {Promise<Object>} - Success message
 */
export const updatePassword = async (token, passwordData) => {
  try {
    const response = await fetch(`${API_URL}/settings/password`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passwordData),
      credentials: 'include', // Include cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to update password');
    }

    return await response.json();
  } catch (error) {
    console.error('Update password error:', error);
    throw error;
  }
};

/**
 * Export user data
 * @param {string} token - Access token
 * @returns {Promise<Object>} - User data export
 */
export const exportUserData = async (token) => {
  try {
    const response = await fetch(`${API_URL}/settings/export`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include', // Include cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to export user data');
    }

    return await response.json();
  } catch (error) {
    console.error('Export user data error:', error);
    throw error;
  }
};

/**
 * Delete user account
 * @param {string} token - Access token
 * @param {string} confirmation - Confirmation text
 * @returns {Promise<Object>} - Success message
 */
export const deleteUserAccount = async (token, confirmation) => {
  try {
    const response = await fetch(`${API_URL}/settings/delete-account`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ confirmation }),
      credentials: 'include', // Include cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to delete user account');
    }

    return await response.json();
  } catch (error) {
    console.error('Delete user account error:', error);
    throw error;
  }
};

/**
 * Get user sessions
 * @param {string} token - Access token
 * @returns {Promise<Object>} - User sessions
 */
export const getUserSessions = async (token) => {
  try {
    const response = await fetch(`${API_URL}/settings/sessions`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include', // Include cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch user sessions');
    }

    return await response.json();
  } catch (error) {
    console.error('Get user sessions error:', error);
    throw error;
  }
};

/**
 * Terminate user session
 * @param {string} token - Access token
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} - Success message
 */
export const terminateSession = async (token, sessionId) => {
  try {
    const response = await fetch(`${API_URL}/settings/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include', // Include cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to terminate session');
    }

    return await response.json();
  } catch (error) {
    console.error('Terminate session error:', error);
    throw error;
  }
};

/**
 * Terminate all sessions except current
 * @param {string} token - Access token
 * @returns {Promise<Object>} - Success message
 */
export const terminateAllSessions = async (token) => {
  try {
    const response = await fetch(`${API_URL}/settings/sessions`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include', // Include cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to terminate all sessions');
    }

    return await response.json();
  } catch (error) {
    console.error('Terminate all sessions error:', error);
    throw error;
  }
};

export default {
  getUserSettings,
  updateUserProfile,
  updateNotificationSettings,
  updatePassword,
  exportUserData,
  deleteUserAccount,
  getUserSessions,
  terminateSession,
  terminateAllSessions,
};