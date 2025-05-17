/**
 * Customer Dashboard API client
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Get dashboard data for the authenticated customer
 * @param {string} token - Access token
 * @returns {Promise<Object>} - Dashboard data
 */
export const getDashboardData = async (token) => {
  try {
    const response = await fetch(`${API_URL}/customer/dashboard`, {
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

export default {
  getDashboardData,
};