const protectedRouteService = require('../services/protectedRoute.service');
const { handleError } = require('../utils/error');
const { StatusCodes } = require('http-status-codes');

class ProtectedRouteController {
  /**
   * Check authorization for protected routes
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async checkAuthorization(req, res) {
    try {
      // Get the token from the Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          error: {
            message: 'Authentication required'
          }
        });
      }
      
      // Extract the token
      const token = authHeader.split(' ')[1];
      
      // Get the allowed roles from the query parameters, defaults to all roles
      const allowedRoles = req.query.roles ? req.query.roles.split(',') : ['customer', 'sales_ops', 'admin'];
      
      const result = await protectedRouteService.checkAuthorization(token, allowedRoles);
      
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      handleError(res, error);
    }
  }
}

module.exports = new ProtectedRouteController();