const Exercise = require('../models/mongo/Exercise');

// @route   GET /api/exercises
// @desc    Get all exercises
// @access  Public (or Private if authentication is added)
exports.getExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
