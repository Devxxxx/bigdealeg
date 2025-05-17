const express = require('express');
const scheduledViewingController = require('../controllers/scheduledViewing.controller');
const { authMiddleware, authorize } = require('../middleware/auth.middleware');
const { body } = require('express-validator');
const validationMiddleware = require('../middleware/validation.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Validation schemas
const createViewingValidation = [
  body('property_id').notEmpty().withMessage('Property ID is required'),
  body('notes').optional().isString().withMessage('Notes must be a string')
];

const updateViewingValidation = [
  body('notes').optional().isString().withMessage('Notes must be a string')
];

const proposeViewingValidation = [
  body('proposed_dates').isArray().notEmpty().withMessage('Proposed dates are required'),
  body('proposed_times').isArray().notEmpty().withMessage('Proposed times are required')
];

const selectSlotValidation = [
  body('selected_date').notEmpty().withMessage('Selected date is required'),
  body('selected_time').notEmpty().withMessage('Selected time is required')
];

const confirmViewingValidation = [
  body('private_notes').optional().isString().withMessage('Private notes must be a string')
];

// Routes accessible to all authenticated users
router.get('/', scheduledViewingController.getScheduledViewings);
router.get('/:id', scheduledViewingController.getScheduledViewingById);

// Routes for customers and other roles
router.post('/', createViewingValidation, validationMiddleware, scheduledViewingController.createScheduledViewing);
router.put('/:id', updateViewingValidation, validationMiddleware, scheduledViewingController.updateScheduledViewing);
router.delete('/:id', scheduledViewingController.deleteScheduledViewing);
router.post('/:id/cancel', scheduledViewingController.cancelScheduledViewing);

// Routes accessible only to sales ops and admins
router.post('/:id/propose-slots',
  authorize(['sales_ops', 'admin']),
  proposeViewingValidation,
  validationMiddleware,
  scheduledViewingController.proposeViewingSlots
);

router.post('/:id/confirm', 
  authorize(['sales_ops', 'admin']), 
  confirmViewingValidation,
  validationMiddleware,
  scheduledViewingController.confirmScheduledViewing
);

router.post('/:id/complete', 
  authorize(['sales_ops', 'admin']), 
  scheduledViewingController.completeScheduledViewing
);

// Route for customers to select a slot
router.post('/:id/select-slot',
  selectSlotValidation,
  validationMiddleware,
  scheduledViewingController.selectViewingSlot
);

module.exports = router;