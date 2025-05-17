const express = require('express');
const notificationController = require('../controllers/notification.controller');
const { authMiddleware, authorize } = require('../middleware/auth.middleware');
const { body } = require('express-validator');
const validationMiddleware = require('../middleware/validation.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Notification routes accessible to all authenticated users
router.get('/sidebar', notificationController.getSidebarNotifications);
router.get('/', notificationController.getUserNotifications);
router.post('/:id/read', notificationController.markAsRead);
router.post('/read-all', notificationController.markAllAsRead);
router.delete('/:id', notificationController.deleteNotification);

// Token management
router.post('/token', [
  body('token').notEmpty().withMessage('Token is required'),
  body('device_type').optional().isIn(['web', 'android', 'ios']).withMessage('Invalid device type')
], validationMiddleware, notificationController.saveFCMToken);

// Creating notifications - restricted to admin and sales ops
router.post('/', [
  body('title').notEmpty().withMessage('Title is required'),
  body('message').notEmpty().withMessage('Message is required'),
  body('user_id').notEmpty().withMessage('User ID is required'),
  body('type').optional().isIn(['system', 'alert', 'success', 'update', 'message']).withMessage('Invalid notification type')
], validationMiddleware, authorize(['admin', 'sales_ops']), notificationController.createNotification);

module.exports = router;