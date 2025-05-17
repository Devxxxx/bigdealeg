const express = require('express');
const protectedRouteController = require('../controllers/protectedRoute.controller');

const router = express.Router();

// Routes
router.get('/check-authorization', protectedRouteController.checkAuthorization);

module.exports = router;