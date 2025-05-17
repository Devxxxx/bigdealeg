const express = require('express');
const customerDashboardController = require('../controllers/customerDashboard.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Dashboard routes
router.get('/dashboard', customerDashboardController.getDashboardData);

module.exports = router;