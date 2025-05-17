const { StatusCodes } = require('http-status-codes');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

const handleError = (res, error) => {
  console.error('Error:', error);
  
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      error: {
        message: error.message
      }
    });
  }
  
  // For unknown errors (not operational)
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: {
      message: 'Internal server error'
    }
  });
};

module.exports = {
  AppError,
  handleError
};