const { check } = require('express-validator');

exports.createRoutineValidation = [
  check('name', 'Routine name is required').not().isEmpty(),
];

exports.updateRoutineValidation = [
  check('name', 'Routine name is required').optional().not().isEmpty(),
];

exports.registerProgressValidation = [
  check('date', 'Date is required').isISO8601().toDate(),
  check('reps', 'Reps must be an integer').optional().isInt(),
  check('time', 'Time must be an integer').optional().isInt(),
  check('effort', 'Effort must be an integer between 1 and 10').optional().isInt({ min: 1, max: 10 }),
];
