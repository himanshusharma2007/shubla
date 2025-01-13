const express = require('express');
const router = express.Router();
const { 
  generateDashboardMetrics, 
  getDashboardMetrics,
  getEarningsMetrics
} = require('../controller/dashboardController');
const { checkAdmin } = require('../middleware/checkAdmin');

// Protected admin routes
router.use(checkAdmin);

// Generate/update dashboard metrics
router.post('/metrics', generateDashboardMetrics);

// Get dashboard metrics
router.get('/metrics', getDashboardMetrics);

// Get earnings metrics
router.get('/earnings', getEarningsMetrics);

module.exports = router;