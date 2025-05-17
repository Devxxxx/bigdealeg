const jwt = require('jsonwebtoken');
const supabase = require('../utils/supabase');
const { AppError } = require('../utils/error');
const { StatusCodes } = require('http-status-codes');

class ProtectedRouteService {
  /**
   * Check if user is authorized to access a route with specific roles
   * @param {string} token - JWT token
   * @param {string[]} allowedRoles - Allowed roles for the route
   * @returns {Promise<Object>} - User data and authorization result
   */
  async checkAuthorization(token, allowedRoles = ['customer', 'sales_ops', 'admin']) {
    try {
      if (!token) {
        throw new AppError('No access token provided', StatusCodes.UNAUTHORIZED);
      }

      // First, verify the JWT token
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
          throw new AppError('Invalid or expired token', StatusCodes.UNAUTHORIZED);
        }
        throw error;
      }

      // Get the user's profile to check their role
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, name, email, role')
        .eq('id', decoded.id)
        .single();

      if (error || !profile) {
        throw new AppError('User profile not found', StatusCodes.NOT_FOUND);
      }

      // Check if the user's role is in the allowed roles
      const isAuthorized = allowedRoles.includes(profile.role);
      
      if (!isAuthorized) {
        throw new AppError(`Access denied: User role '${profile.role}' not allowed`, StatusCodes.FORBIDDEN);
      }

      return {
        user: profile,
        authState: 'authorized'
      };
    } catch (error) {
      if (error.isOperational) {
        throw error;
      }
      
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw new AppError('Authentication failed: Invalid or expired token', StatusCodes.UNAUTHORIZED);
      }
      
      throw new AppError('Authorization failed: ' + (error.message || 'Unknown error'), StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = new ProtectedRouteService();