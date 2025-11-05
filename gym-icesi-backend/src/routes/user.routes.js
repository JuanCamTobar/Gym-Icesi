const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
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

// @route   GET /users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/', auth, authorize('ADMIN'), userController.getUsers);

// @route   PUT /users/:username/assign-trainer
// @desc    Assign a trainer to a user
// @access  Private (Admin only)
router.put('/:username/assign-trainer', auth, authorize('ADMIN'), userController.assignTrainer);

module.exports = router;
