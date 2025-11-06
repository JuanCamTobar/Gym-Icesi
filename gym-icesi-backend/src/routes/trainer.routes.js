const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainer.controller');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// @route   GET /trainers
// @desc    Get all trainers
// @access  Private (Admin or Trainer)
router.get('/', auth, authorize('ADMIN', 'EMPLOYEE'), trainerController.getTrainers);

// @route   GET /trainers/:id/users
// @desc    Get users assigned to a trainer
// @access  Private (Admin or owner trainer)
router.get('/:id/users', auth, authorize('ADMIN', 'EMPLOYEE'), trainerController.getTrainerUsers);

// @route   GET /api/trainer/assigned-students
// @desc    Get students assigned to the logged-in instructor
// @access  Private (Instructor only)
router.get('/assigned-students', auth, authorize('EMPLOYEE'), trainerController.getAssignedStudents);

module.exports = router;
