const express = require('express');
const router = express.Router();
const routineController = require('../controllers/routine.controller');
const auth = require('../middlewares/auth');
const { createRoutineValidation, updateRoutineValidation, registerProgressValidation } = require('../middlewares/validation/routine.validation');
const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// @route   GET /routines
// @desc    Get all routines for the authenticated user
// @access  Private (User, Trainer, Admin)
router.get('/', auth, routineController.getRoutines);

// @route   POST /routines
// @desc    Create a new routine
// @access  Private (User, Trainer, Admin)
router.post('/', auth, createRoutineValidation, validate, routineController.createRoutine);

// @route   PUT /routines/:id
// @desc    Update routine by ID
// @access  Private (Owner of the routine)
router.put('/:id', auth, updateRoutineValidation, validate, routineController.updateRoutine);

// @route   DELETE /routines/:id
// @desc    Delete routine by ID
// @access  Private (Owner of the routine)
router.delete('/:id', auth, routineController.deleteRoutine);

// @route   POST /routines/:id/progress
// @desc    Register progress for a routine
// @access  Private (Owner of the routine)
router.post('/:id/progress', auth, registerProgressValidation, validate, routineController.registerProgress);

module.exports = router;
