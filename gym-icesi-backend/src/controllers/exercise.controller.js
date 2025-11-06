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

// @route   POST /api/exercises
// @desc    Create a new exercise
// @access  Private (Trainer only)
exports.createExercise = async (req, res) => {
  const { name, description, type, duration, difficulty, video_url } = req.body;

  try {
    const newExercise = new Exercise({
      name,
      description,
      type,
      duration,
      difficulty,
      video_url,
    });

    const exercise = await newExercise.save();
    res.status(201).json(exercise);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
