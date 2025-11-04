const { check } = require('express-validator');

exports.createTrainerValidation = [
  check('name', 'Name is required').not().isEmpty(),
  check('specialization', 'Specialization is required').not().isEmpty(),
];

exports.updateTrainerValidation = [
  check('name', 'Name is required').optional().not().isEmpty(),
  check('specialization', 'Specialization is required').optional().not().isEmpty(),
];
