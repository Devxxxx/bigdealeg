/**
 * Notifications API client
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Get notification counts for the sidebar
 * @param {string} token - Access token
 * @returns {Promise<Object>} - Notification counts
 */
export const getSidebarNotifications = async (token) => {
  try {
    const timestamp = Date.now();
    const response = await fetch(`${API_URL}/notifications/sidebar?_t=${timestamp}`, {
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
      throw new Error(errorData.error?.message || 'Failed to fetch notifications');
    }

    const data = await response.json();
    return data.notifications;
  } catch (error) {
    console.error('Get sidebar notifications error:', error);
    // Return default values on error
    return {
      propertyRequests: 0,
      scheduledViewings: 0,
      savedProperties: 0,
      messages: 0
    };
  }
};

export default {
  getSidebarNotifications,
};