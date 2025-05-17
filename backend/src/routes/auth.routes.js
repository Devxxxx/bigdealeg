const express = require('express');
const authController = require('../controllers/auth.controller');
const { body } = require('express-validator');
const validationMiddleware = require('../middleware/validation.middleware');

const router = express.Router();

// Validation rules
const signUpValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').notEmpty().withMessage('Name is required')
];

const signInValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/signin', signInValidation, validationMiddleware, authController.signIn);
router.post('/signup', signUpValidation, validationMiddleware, authController.signUp);
router.post('/signout', authController.signOut);
router.get('/session', authController.getSession);
router.post('/refresh-token', authController.refreshToken);
router.get('/profile/:id', authController.getUserProfile);

module.exports = router;