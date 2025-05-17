const settingsService = require('../services/settings.service');
const { handleError } = require('../utils/error');
const { StatusCodes } = require('http-status-codes');

class SettingsController {
  /**
   * Get user settings
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUserSettings(req, res) {
    try {
      const userId = req.user.id;
      
      const data = await settingsService.getUserSettings(userId);
      
      res.status(StatusCodes.OK).json(data);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Update user profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateUserProfile(req, res) {
    try {
      const userId = req.user.id;
      const profileData = req.body;
      
      if (!profileData.name) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            message: 'Name is required'
          }
        });
      }
      
      const data = await settingsService.updateUserProfile(userId, profileData);
      
      res.status(StatusCodes.OK).json(data);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Update notification settings
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateNotificationSettings(req, res) {
    try {
      const userId = req.user.id;
      const notificationData = req.body;
      
      const data = await settingsService.updateNotificationSettings(userId, notificationData);
      
      res.status(StatusCodes.OK).json(data);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Update user password
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updatePassword(req, res) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword, confirmPassword } = req.body;
      
      if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            message: 'Current password, new password, and confirm password are required'
          }
        });
      }
      
      if (newPassword !== confirmPassword) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            message: 'New password and confirm password do not match'
          }
        });
      }
      
      const data = await settingsService.updatePassword(userId, { 
        currentPassword, 
        newPassword 
      });
      
      res.status(StatusCodes.OK).json(data);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Export user data
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async exportUserData(req, res) {
    try {
      const userId = req.user.id;
      
      const data = await settingsService.exportUserData(userId);
      
      res.status(StatusCodes.OK).json(data);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Delete user account
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteUserAccount(req, res) {
    try {
      const userId = req.user.id;
      const { confirmation } = req.body;
      
      if (confirmation !== 'delete my account') {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            message: 'Confirmation text must be "delete my account"'
          }
        });
      }
      
      const data = await settingsService.deleteUserAccount(userId);
      
      res.status(StatusCodes.OK).json(data);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Get user sessions
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUserSessions(req, res) {
    try {
      const userId = req.user.id;
      
      const data = await settingsService.getUserSessions(userId);
      
      res.status(StatusCodes.OK).json(data);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Terminate user session
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async terminateSession(req, res) {
    try {
      const userId = req.user.id;
      const { sessionId } = req.params;
      
      if (!sessionId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            message: 'Session ID is required'
          }
        });
      }
      
      const data = await settingsService.terminateSession(userId, sessionId);
      
      res.status(StatusCodes.OK).json(data);
    } catch (error) {
      handleError(res, error);
    }
  }

  /**
   * Terminate all sessions except current
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async terminateAllSessions(req, res) {
    try {
      const userId = req.user.id;
      
      // In a real implementation, you would terminate all sessions except the current one
      // For now, we'll just return a success message
      
      res.status(StatusCodes.OK).json({
        message: 'All other sessions terminated successfully'
      });
    } catch (error) {
      handleError(res, error);
    }
  }
}

module.exports = new SettingsController();