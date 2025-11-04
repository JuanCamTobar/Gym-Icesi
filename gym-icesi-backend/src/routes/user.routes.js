const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const { createUserValidation, updateUserValidation } = require('../middlewares/validation/user.validation');
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
router.get('/', auth, authorize('admin'), userController.getUsers);

// @route   GET /users/:id
// @desc    Get user by ID
// @access  Private (Admin or owner)
router.get('/:id', auth, userController.getUserById);

// @route   POST /users
// @desc    Create a new user
// @access  Private (Admin only)
router.post('/', auth, authorize('admin'), createUserValidation, validate, userController.createUser);

// @route   PUT /users/:id
// @desc    Update user by ID
// @access  Private (Admin or owner)
router.put('/:id', auth, updateUserValidation, validate, userController.updateUser);

// @route   DELETE /users/:id
// @desc    Delete user by ID
// @access  Private (Admin only)
router.delete('/:id', auth, authorize('admin'), userController.deleteUser);

module.exports = router;
