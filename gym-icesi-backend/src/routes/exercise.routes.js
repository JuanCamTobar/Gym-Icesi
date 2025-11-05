const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exercise.controller');
const auth = require('../middlewares/auth'); // Assuming authentication middleware

// @route   GET /api/exercises
// @desc    Get all exercises
// @access  Private (requires authentication)
router.get('/', auth, exerciseController.getExercises);

module.exports = router;
