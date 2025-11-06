const express = require('express');
const router = express.Router();
const predefinedRoutineController = require('../controllers/predefined-routine.controller');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

// @route   POST /api/predefined-routines
// @desc    Create a new predefined routine
// @access  Private (Trainer only)
router.post('/', auth, authorize('EMPLOYEE'), predefinedRoutineController.createPredefinedRoutine);

// @route   GET /predefined-routines
// @desc    Get all predefined routines
// @access  Private
router.get('/', auth, predefinedRoutineController.getPredefinedRoutines);

module.exports = router;