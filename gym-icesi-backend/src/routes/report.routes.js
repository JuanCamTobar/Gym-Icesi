const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

// Admin Routes
router.get('/admin/overview', auth, authorize('ADMIN'), reportController.getAdminOverviewReport);
router.get('/admin/user-activity', auth, authorize('ADMIN'), reportController.getAdminUserActivityReport);

// Trainer Routes
router.get('/trainer/student-overview', auth, authorize('EMPLOYEE'), reportController.getTrainerStudentOverview);
router.get('/trainer/student-progress', auth, authorize('EMPLOYEE'), reportController.getTrainerStudentProgress);

// User Routes
router.get('/user/consistency', auth, authorize('STUDENT', 'EMPLOYEE'), reportController.getUserConsistencyReport);
router.get('/user/total-routines', auth, authorize('STUDENT', 'EMPLOYEE'), reportController.getUserTotalRoutinesCompleted);

module.exports = router;

