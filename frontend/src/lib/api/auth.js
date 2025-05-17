/**
 * Authentication API client
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Sign in with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - Authentication response
 */
export const signIn = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include', // Include cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Authentication failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

/**
 * Sign up with email, password, and name
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} name - User name
 * @returns {Promise<Object>} - Registration response
 */
export const signUp = async (email, password, name) => {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Registration failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

/**
 * Sign out
 * @returns {Promise<Object>} - Sign out response
 */
export const signOut = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/signout`, {
      method: 'POST',
      credentials: 'include', // Include cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Sign out failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

/**
 * Get current session
 * @param {string} token - Access token
 * @returns {Promise<Object>} - Session response
 */
export const getSession = async (token) => {
  try {
    const response = await fetch(`${API_URL}/auth/session`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include', // Include cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to retrieve session');
    }

    return await response.json();
  } catch (error) {
    console.error('Get session error:', error);
    throw error;
  }
};

/**
 * Refresh access token
 * @returns {Promise<Object>} - Token refresh response
 */
export const refreshToken = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include', // Include cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to refresh token');
    }

    return await response.json();
  } catch (error) {
    console.error('Refresh token error:', error);
    throw error;
  }
};

/**
 * Get user profile
 * @param {string} userId - User ID
 * @param {string} token - Access token
 * @returns {Promise<Object>} - User profile response
 */
export const getUserProfile = async (userId, token) => {
  try {
    const response = await fetch(`${API_URL}/auth/profile/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to get user profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
};

export default {
  signIn,
  signUp,
  signOut,
  getSession,
  refreshToken,
  getUserProfile,
};