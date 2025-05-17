/**
 * Protected Route API client
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Check if user is authorized to access a route with specific roles
 * @param {string} token - Access token
 * @param {string[]} allowedRoles - Allowed roles for the route
 * @returns {Promise<Object>} - Authorization result
 */
export const checkAuthorization = async (token, allowedRoles = ['customer', 'sales_ops', 'admin']) => {
  try {
    const queryParams = new URLSearchParams();
    if (allowedRoles && allowedRoles.length) {
      queryParams.append('roles', allowedRoles.join(','));
    }

    const response = await fetch(`${API_URL}/protected-route/check-authorization?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include', // Include cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Authorization check failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Check authorization error:', error);
    throw error;
  }
};

export default {
  checkAuthorization,
};