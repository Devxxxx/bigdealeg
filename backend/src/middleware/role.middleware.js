const { AppError } = require('../utils/error');
const { StatusCodes } = require('http-status-codes');

/**
 * Middleware for role-based access control
 * @param {string[]} allowedRoles - Roles that are allowed to access the resource
 * @returns {Function} - Express middleware function
 */
exports.roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      // Check if user exists and has a role
      if (!req.user || !req.user.role) {
        throw new AppError('Unauthorized', StatusCodes.UNAUTHORIZED);
      }

      // Check if user's role is in the allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        throw new AppError('Access denied', StatusCodes.FORBIDDEN);
      }

      // User is authorized, proceed to next middleware
      next();
    } catch (error) {
      next(error);
    }
  };
};