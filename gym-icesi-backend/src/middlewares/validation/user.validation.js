const { check } = require('express-validator');

exports.createUserValidation = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  check('role', 'Role is required').not().isEmpty(),
];

exports.updateUserValidation = [
  check('name', 'Name is required').optional().not().isEmpty(),
  check('email', 'Please include a valid email').optional().isEmail(),
  check('password', 'Please enter a password with 6 or more characters').optional().isLength({ min: 6 }),
  check('role', 'Role is required').optional().not().isEmpty(),
];
