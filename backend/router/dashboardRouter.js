const express = require('express');
const router = express.Router();
const { 
  generateDashboardMetrics, 
  getDashboardMetrics,
  getEarningsMetrics
} = require('../controllers/dashboardController');
const { checkAdmin } = require('../middleware/checkAdmin');

// Protected admin routes
router.use(checkAdmin);

// Generate/update dashboard metrics
router.post('/dashboard/metrics', generateDashboardMetrics);

// Get dashboard metrics
router.get('/dashboard/metrics', getDashboardMetrics);

// Get earnings metrics
router.get('/dashboard/earnings', getEarningsMetrics);

module.exports = router;