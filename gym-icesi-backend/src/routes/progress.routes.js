const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progress.controller');
const auth = require('../middlewares/auth');

// @route   POST /api/progress
// @desc    Record daily progress for a routine
// @access  Private
router.post('/', auth, progressController.recordDailyProgress);

// @route   GET /api/progress/routine/:routineId
// @desc    Get progress for a specific routine by the authenticated user
// @access  Private
router.get('/routine/:routineId', auth, progressController.getProgressByRoutine);

// @route   GET /api/progress/routine/:routineId/student/:studentUsername
// @desc    Get progress for a specific routine and student
// @access  Private (Instructor authorized to view this student)
router.get('/routine/:routineId/student/:studentUsername', auth, progressController.getProgressByRoutineAndStudent);

// @route   POST /api/progress/:id/comment
// @desc    Add a comment to a progress tracking entry
// @access  Private (Trainer)
router.post('/:id/comment', auth, progressController.addComment);

module.exports = router;
