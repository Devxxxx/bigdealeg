const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');

/**
 * Express validator middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        message: 'Validation failed',
        details: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      }
    });
  }
  
  next();
};

module.exports = validationMiddleware;