const express = require('express');
const propertyController = require('../controllers/property.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { roleMiddleware } = require('../middleware/role.middleware');

const router = express.Router();

// Public routes
router.get('/', propertyController.getAllProperties);
router.get('/:id', propertyController.getPropertyById);
router.get('/:id/similar', propertyController.getSimilarProperties);
router.get('/:id/images', propertyController.getPropertyImages);

// Protected routes
router.post('/', authMiddleware, roleMiddleware(['sales_ops', 'admin']), propertyController.createProperty);
router.post('/:id/increment-views', authMiddleware, propertyController.incrementPropertyViews);
router.post('/:id/images', authMiddleware, roleMiddleware(['sales_ops', 'admin']), propertyController.uploadPropertyImages);
router.put('/:id', authMiddleware, roleMiddleware(['sales_ops', 'admin']), propertyController.updateProperty);
router.delete('/images/:imageId', authMiddleware, roleMiddleware(['sales_ops', 'admin']), propertyController.deletePropertyImage);

module.exports = router;