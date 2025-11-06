const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exercise.controller');
const auth = require('../middlewares/auth'); // Assuming authentication middleware
const authorize = require('../middlewares/authorize');

// @route   GET /api/exercises
// @desc    Get all exercises
// @access  Private (requires authentication)
router.get('/', auth, exerciseController.getExercises);

// @route   POST /api/exercises
// @desc    Create a new exercise
// @access  Private (Trainer only)
router.post('/', auth, authorize('EMPLOYEE'), exerciseController.createExercise);

module.exports = router;
