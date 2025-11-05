const express = require('express');
const router = express.Router();
const customRoutineController = require('../controllers/custom-routine.controller');
const auth = require('../middlewares/auth');

router.post('/', auth, customRoutineController.createCustomRoutine);

// @route   POST /custom-routines/adopt
// @desc    Adopt a predefined routine
// @access  Private
router.post('/adopt', auth, customRoutineController.adoptPredefinedRoutine);

// @route   GET /custom-routines
// @desc    Get all custom routines for the current user
// @access  Private
router.get('/', auth, customRoutineController.getCustomRoutines);

module.exports = router;