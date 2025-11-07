const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statistics.controller');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

// --- User Routes ---

// @route   GET /api/statistics/user/routines
// @desc    Get the logged-in user's started routines, grouped by month
// @access  Private
router.get('/user/routines', auth, statisticsController.getUserStartedRoutines);

// @route   GET /api/statistics/user/progress-calendar
// @desc    Get progress calendar data for the logged-in user for a specific month
// @access  Private
router.get('/user/progress-calendar', auth, statisticsController.getUserProgressCalendar);

// --- Trainer Routes ---

// @route   GET /api/statistics/trainer/my-stats
// @desc    Get statistics for the logged-in trainer
// @access  Private (Employee role required)
router.get('/trainer/my-stats', auth, authorize('EMPLOYEE', 'ADMIN'), statisticsController.getTrainerStats);

// --- Admin Routes ---

// @route   GET /api/statistics/admin/overview
// @desc    Get aggregated stats for the admin dashboard
// @access  Private (Admin role required)
router.get('/admin/overview', auth, authorize('ADMIN'), statisticsController.getAdminOverview);

module.exports = router;