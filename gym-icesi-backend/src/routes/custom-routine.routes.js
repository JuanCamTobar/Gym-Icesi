const express = require('express');
const router = express.Router();
const customRoutineController = require('../controllers/custom-routine.controller');
const auth = require('../middlewares/auth');

router.post('/', auth, customRoutineController.createCustomRoutine);
router.get('/:id', auth, customRoutineController.getCustomRoutineById);
router.put('/:id', auth, customRoutineController.updateCustomRoutine);
router.delete('/:id', auth, customRoutineController.deleteCustomRoutine);

// @route   POST /custom-routines/adopt
// @desc    Adopt a predefined routine
// @access  Private
router.post('/adopt', auth, customRoutineController.adoptPredefinedRoutine);

// @route   GET /custom-routines
// @desc    Get all custom routines for the current user
// @access  Private
router.get('/', auth, customRoutineController.getCustomRoutines);

// @route   GET /custom-routines/student/:studentUsername
// @desc    Get all custom routines for a specific student
// @access  Private (Instructor authorized to view this student)
router.get('/student/:studentUsername', auth, customRoutineController.getCustomRoutinesByStudent);

module.exports = router;