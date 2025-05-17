const express = require('express');
const adminController = require('../controllers/admin.controller');
const { authMiddleware, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes require authentication and admin role
router.use(authMiddleware);
router.use(authorize(['admin']));

// Dashboard routes
router.get('/dashboard', adminController.getDashboardData);

// User management routes
router.get('/users', adminController.getUsers);
router.get('/users/:userId', adminController.getUserById);
router.put('/users/:userId/role', adminController.updateUserRole);
router.put('/users/:userId/status', adminController.toggleUserStatus);
router.delete('/users/:userId', adminController.deleteUser);

// Form fields management routes
router.get('/form-fields', adminController.getFormFields);
router.post('/form-fields', adminController.createFormField);
router.put('/form-fields/:fieldId', adminController.updateFormField);
router.delete('/form-fields/:fieldId', adminController.deleteFormField);
router.put('/form-fields/:fieldId/required', adminController.toggleFieldRequired);
router.put('/form-fields/:fieldId/order', adminController.updateFieldOrder);

// System settings routes
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);
router.post('/settings/reset', adminController.resetSettings);

module.exports = router;