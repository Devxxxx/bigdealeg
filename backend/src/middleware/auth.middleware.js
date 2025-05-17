const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { AppError } = require('../utils/error');
const supabase = require('../utils/supabase');

/**
 * Authentication middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get the authorization header
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
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists in the database
    const { data: user, error } = await supabase
      .from('profiles')
      .select('id, name, email, role')
      .eq('id', decoded.id)
      .single();
    
    if (error || !user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: {
          message: 'Authentication failed'
        }
      });
    }
    
    // Add user info to the request object
    req.user = user;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: {
          message: 'Invalid or expired token'
        }
      });
    }
    
    next(new AppError(error.message || 'Authentication failed', StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

/**
 * Role-based authorization middleware
 * @param {string[]} roles - Allowed roles
 * @returns {Function} - Express middleware
 */
const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: {
          message: 'Authentication required'
        }
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: {
          message: 'Access denied: insufficient permissions'
        }
      });
    }
    
    next();
  };
};

module.exports = {
  authMiddleware,
  authorize
};