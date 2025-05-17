const express = require('express');
const salesOpsController = require('../controllers/salesOps.controller');
const { authMiddleware, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes require authentication and sales_ops or admin role
router.use(authMiddleware);
router.use(authorize(['sales_ops', 'admin']));

// Dashboard routes
router.get('/dashboard', salesOpsController.getDashboardData);

// Property management routes
router.get('/properties', salesOpsController.getProperties);
router.post('/properties', salesOpsController.createProperty);
router.post('/properties/:id/toggle-availability', salesOpsController.togglePropertyAvailability);
router.delete('/properties/:id', salesOpsController.deleteProperty);

// Property requests routes
router.get('/property-requests', salesOpsController.getPropertyRequests);
router.get('/property-requests/:id', salesOpsController.getPropertyRequestById);
router.put('/property-requests/:id/status', salesOpsController.updatePropertyRequestStatus);

// Scheduled viewings routes
router.get('/scheduled-viewings', salesOpsController.getScheduledViewings);
router.get('/scheduled-viewings/:id', salesOpsController.getScheduledViewingById);

module.exports = router;