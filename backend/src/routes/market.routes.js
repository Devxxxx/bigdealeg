const express = require('express');
const marketInsightController = require('../controllers/marketInsight.controller');

const router = express.Router();

// Public routes
router.get('/insights', marketInsightController.getMarketInsights);

module.exports = router;