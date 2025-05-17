const marketInsightService = require('../services/marketInsight.service');
const { handleError } = require('../utils/error');
const { StatusCodes } = require('http-status-codes');

class MarketInsightController {
  /**
   * Get market insights
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getMarketInsights(req, res) {
    try {
      const insights = await marketInsightService.getMarketInsights();
      
      res.status(StatusCodes.OK).json({ insights });
    } catch (error) {
      handleError(res, error);
    }
  }
}

module.exports = new MarketInsightController();