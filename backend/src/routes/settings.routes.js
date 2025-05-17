const express = require('express');
const settingsController = require('../controllers/settings.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get user settings
router.get('/', settingsController.getUserSettings);

// Update user profile
router.put('/profile', settingsController.updateUserProfile);

// Update notification settings
router.put('/notifications', settingsController.updateNotificationSettings);

// Update password
router.put('/password', settingsController.updatePassword);

// Export user data
router.get('/export', settingsController.exportUserData);

// Delete user account
router.post('/delete-account', settingsController.deleteUserAccount);

// Get user sessions
router.get('/sessions', settingsController.getUserSessions);

// Terminate user session
router.delete('/sessions/:sessionId', settingsController.terminateSession);

// Terminate all sessions except current
router.delete('/sessions', settingsController.terminateAllSessions);

module.exports = router;