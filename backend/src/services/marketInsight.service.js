const supabase = require('../utils/supabase');
const { AppError } = require('../utils/error');
const { StatusCodes } = require('http-status-codes');

class MarketInsightService {
  /**
   * Get market insights data
   * @returns {Promise<Object>} - Market insights data
   */
  async getMarketInsights() {
    try {
      const { data, error } = await supabase
        .from('market_insights')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) {
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
      }
      
      return data[0] || null;
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      throw new AppError(error.message || 'Failed to get market insights', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = new MarketInsightService();