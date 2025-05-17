const customerDashboardService = require('../services/customerDashboard.service');
const { handleError } = require('../utils/error');
const { StatusCodes } = require('http-status-codes');

class CustomerDashboardController {
  /**
   * Get dashboard data for the authenticated customer
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getDashboardData(req, res) {
    try {
      const userId = req.user.id;

      if (!userId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            message: 'User ID is required'
          }
        });
      }

      const dashboardData = await customerDashboardService.getDashboardData(userId);
      res.status(StatusCodes.OK).json(dashboardData);
    } catch (error) {
      handleError(res, error);
    }
  }
}

module.exports = new CustomerDashboardController();