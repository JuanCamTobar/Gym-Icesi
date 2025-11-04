const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statistics.controller');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

// @route   GET /statistics/users/:month
// @desc    Get user statistics for a specific month
// @access  Private (Admin)
router.get('/users/:month', auth, authorize('admin'), statisticsController.getUserStatistics);

// @route   GET /statistics/trainers/:month
// @desc    Get trainer statistics for a specific month
// @access  Private (Admin)
router.get('/trainers/:month', auth, authorize('admin'), statisticsController.getTrainerStatistics);

module.exports = router;
