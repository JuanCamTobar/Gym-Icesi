const express = require('express');
const router = express.Router();
const predefinedRoutineController = require('../controllers/predefined-routine.controller');
const auth = require('../middlewares/auth');

// @route   GET /predefined-routines
// @desc    Get all predefined routines
// @access  Private
router.get('/', auth, predefinedRoutineController.getPredefinedRoutines);

module.exports = router;