const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainer.controller');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const { createTrainerValidation, updateTrainerValidation } = require('../middlewares/validation/trainer.validation');
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
router.get('/', auth, authorize('admin', 'trainer'), trainerController.getTrainers);

// @route   POST /trainers
// @desc    Create a new trainer
// @access  Private (Admin only)
router.post('/', auth, authorize('admin'), createTrainerValidation, validate, trainerController.createTrainer);

// @route   PUT /trainers/:id
// @desc    Update trainer by ID
// @access  Private (Admin or owner)
router.put('/:id', auth, authorize('admin', 'trainer'), updateTrainerValidation, validate, trainerController.updateTrainer);

// @route   DELETE /trainers/:id
// @desc    Delete trainer by ID
// @access  Private (Admin only)
router.delete('/:id', auth, authorize('admin'), trainerController.deleteTrainer);

// @route   GET /trainers/:id/users
// @desc    Get users assigned to a trainer
// @access  Private (Admin or owner trainer)
router.get('/:id/users', auth, authorize('admin', 'trainer'), trainerController.getTrainerUsers);

module.exports = router;
