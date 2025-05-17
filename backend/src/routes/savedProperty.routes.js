const express = require('express');
const savedPropertyController = require('../controllers/savedProperty.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Routes
router.get('/', savedPropertyController.getSavedProperties);
router.get('/check/:propertyId', savedPropertyController.isPropertySaved);
router.post('/:propertyId', savedPropertyController.saveProperty);
router.post('/', savedPropertyController.saveProperty); // Alternative route with propertyId in body
router.delete('/:propertyId', savedPropertyController.unsaveProperty);
router.delete('/', savedPropertyController.deleteAllSavedProperties);

module.exports = router;