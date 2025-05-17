/**
 * Market Insights API client
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Get market insights
 * @returns {Promise<Object>} - Market insights data
 */
export const getMarketInsights = async () => {
  try {
    const response = await fetch(`${API_URL}/market/insights`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch market insights');
    }

    const data = await response.json();
    return data.insights;
  } catch (error) {
    console.error('Get market insights error:', error);
    throw error;
  }
};

export default {
  getMarketInsights,
};