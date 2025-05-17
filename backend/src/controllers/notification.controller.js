const notificationService = require('../services/notification.service');
const { handleError } = require('../utils/error');
const { StatusCodes } = require('http-status-codes');

class NotificationController {
  /**
   * Get sidebar notification counts
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getSidebarNotifications(req, res) {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;
      
      const notifications = await notificationService.getSidebarNotifications(userId, userRole);
      
      // Set cache control headers to prevent caching
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      
      res.status(StatusCodes.OK).json({
        notifications
      });
    } catch (error) {
      handleError(res, error);
    }
  }
  
  /**
   * Get notifications for a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUserNotifications(req, res) {
    try {
      const userId = req.user.id;
      const filters = {
        is_read: req.query.is_read === 'true' ? true : req.query.is_read === 'false' ? false : undefined,
        type: req.query.type,
        related_entity_type: req.query.entity_type,
        limit: req.query.limit ? parseInt(req.query.limit) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset) : undefined
      };
      
      const { data, count } = await notificationService.getUserNotifications(userId, filters);
      
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      
      res.status(StatusCodes.OK).json({
        notifications: data,
        count: count || data.length,
        filters
      });
    } catch (error) {
      handleError(res, error);
    }
  }
  
  /**
   * Create a notification
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createNotification(req, res) {
    try {
      const notificationData = req.body;
      
      // Check if sender is authorized to send notifications to specified user
      if (req.user.role !== 'admin' && notificationData.user_id !== req.user.id) {
        // Non-admins can only create notifications for themselves
        notificationData.user_id = req.user.id;
      }
      
      const notification = await notificationService.createNotification(notificationData);
      
      res.status(StatusCodes.CREATED).json(notification);
    } catch (error) {
      handleError(res, error);
    }
  }
  
  /**
   * Mark a notification as read
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async markAsRead(req, res) {
    try {
      const notificationId = req.params.id;
      const userId = req.user.id;
      
      const notification = await notificationService.markAsRead(notificationId, userId);
      
      res.status(StatusCodes.OK).json(notification);
    } catch (error) {
      handleError(res, error);
    }
  }
  
  /**
   * Mark all notifications as read
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async markAllAsRead(req, res) {
    try {
      const userId = req.user.id;
      
      const result = await notificationService.markAllAsRead(userId);
      
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      handleError(res, error);
    }
  }
  
  /**
   * Delete a notification
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteNotification(req, res) {
    try {
      const notificationId = req.params.id;
      const userId = req.user.id;
      
      const result = await notificationService.deleteNotification(notificationId, userId);
      
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      handleError(res, error);
    }
  }
  
  /**
   * Save FCM token
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async saveFCMToken(req, res) {
    try {
      const userId = req.user.id;
      const { token, device_type } = req.body;
      
      if (!token) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: {
            message: 'Token is required'
          }
        });
      }
      
      const result = await notificationService.saveFCMToken(userId, token, device_type || 'web');
      
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      handleError(res, error);
    }
  }
}

module.exports = new NotificationController();