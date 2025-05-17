const authService = require('../services/auth.service');
const activityService = require('../services/activity.service');
const { handleError } = require('../utils/error');
const { StatusCodes } = require('http-status-codes');

class AuthController {
  /**
   * Sign in a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async signIn(req, res) {
    try {
      const { email, password } = req.body;
      
      // Validate required fields
      if (!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            message: 'Email and password are required'
          }
        });
      }
      
      const result = await authService.signIn(email, password);
      
      // Log user login activity
      try {
        await activityService.logUserLogin(result.user.id);
      } catch (activityError) {
        // Don't fail the sign-in if logging activity fails
        console.error('Failed to log login activity:', activityError);
      }
      
      // Set HTTP-only cookies for tokens
      res.cookie('refresh_token', result.session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      // Send response
      res.status(StatusCodes.OK).json({
        user: result.user,
        session: {
          access_token: result.session.access_token,
          expires_at: result.session.expires_at
        }
      });
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Sign up a new user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async signUp(req, res) {
    try {
      const { email, password, name } = req.body;
      
      // Validate required fields
      if (!email || !password || !name) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            message: 'Email, password and name are required'
          }
        });
      }
      
      const result = await authService.signUp(email, password, name);
      
      res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Sign out a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async signOut(req, res) {
    try {
      const refreshToken = req.cookies.refresh_token || req.body.refresh_token;
      
      const result = await authService.signOut(refreshToken);
      
      // Clear cookies
      res.clearCookie('refresh_token');
      
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Get user session
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getSession(req, res) {
    try {
      const accessToken = req.headers.authorization?.split(' ')[1];
      
      const result = await authService.getSession(accessToken);
      
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Refresh user token
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async refreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refresh_token || req.body.refresh_token;
      
      if (!refreshToken) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          error: {
            message: 'Refresh token required'
          }
        });
      }
      
      const result = await authService.refreshToken(refreshToken);
      
      // Update HTTP-only cookie
      res.cookie('refresh_token', result.session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      res.status(StatusCodes.OK).json({
        user: result.user,
        session: {
          access_token: result.session.access_token,
          expires_at: result.session.expires_at
        }
      });
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Get user profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUserProfile(req, res) {
    try {
      const userId = req.params.id;
      
      if (!userId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            message: 'User ID is required'
          }
        });
      }
      
      const result = await authService.getUserProfile(userId);
      
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      handleError(res, error);
    }
  }
}

module.exports = new AuthController();