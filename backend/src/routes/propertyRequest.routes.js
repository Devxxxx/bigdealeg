const express = require('express');
const propertyRequestController = require('../controllers/propertyRequest.controller');
const { authMiddleware, authorize } = require('../middleware/auth.middleware');
const { body } = require('express-validator');
const validationMiddleware = require('../middleware/validation.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Validation schemas
const createRequestValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('property_type').notEmpty().withMessage('Property type is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('min_price').isNumeric().withMessage('Minimum price must be a number'),
  body('max_price').isNumeric().withMessage('Maximum price must be a number'),
  body('min_price').custom((value, { req }) => {
    if (value >= req.body.max_price) {
      throw new Error('Minimum price must be less than maximum price');
    }
    return true;
  })
];

const updateRequestValidation = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('property_type').optional().notEmpty().withMessage('Property type cannot be empty'),
  body('location').optional().notEmpty().withMessage('Location cannot be empty'),
  body('min_price').optional().isNumeric().withMessage('Minimum price must be a number'),
  body('max_price').optional().isNumeric().withMessage('Maximum price must be a number'),
  body('min_price').optional().custom((value, { req }) => {
    if (req.body.max_price && value >= req.body.max_price) {
      throw new Error('Minimum price must be less than maximum price');
    }
    return true;
  })
];

// Routes accessible to all authenticated users
router.get('/fields', propertyRequestController.getPropertyRequestFields);
router.get('/', propertyRequestController.getPropertyRequests);
router.get('/:id', propertyRequestController.getPropertyRequestById);

// Routes accessible to customers
router.post('/', createRequestValidation, validationMiddleware, propertyRequestController.createPropertyRequest);
router.put('/:id', updateRequestValidation, validationMiddleware, propertyRequestController.updatePropertyRequest);
router.delete('/:id', propertyRequestController.deletePropertyRequest);

// Routes accessible only to sales ops and admins
router.post('/:id/assign', 
  authorize(['sales_ops', 'admin']), 
  propertyRequestController.assignPropertyRequest
);

router.post('/:id/status', 
  authorize(['sales_ops', 'admin']), 
  propertyRequestController.addStatusUpdate
);

module.exports = router;