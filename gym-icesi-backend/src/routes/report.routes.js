const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

// @route   GET /reports/top-users
// @desc    Get top users based on activity
// @access  Private (Admin)
router.get('/top-users', auth, authorize('admin'), reportController.getTopUsers);

// @route   GET /reports/trainer-performance
// @desc    Get trainer performance metrics
// @access  Private (Admin)
router.get('/trainer-performance', auth, authorize('admin'), reportController.getTrainerPerformance);

module.exports = router;
