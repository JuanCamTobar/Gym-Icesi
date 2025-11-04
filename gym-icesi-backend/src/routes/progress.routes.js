const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progress.controller');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

// @route   GET /progress/user/:id
// @desc    Get progress for a specific user
// @access  Private (Admin or owner)
router.get('/user/:id', auth, progressController.getProgressByUser);

// @route   GET /progress/routine/:id
// @desc    Get progress for a specific routine
// @access  Private (Admin or owner of the routine)
router.get('/routine/:id', auth, progressController.getProgressByRoutine);

module.exports = router;
