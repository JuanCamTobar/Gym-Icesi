const Exercise = require('../models/mongo/Exercise');
const PredefinedRoutine = require('../models/mongo/PredefinedRoutine');

// @route   POST /api/predefined-routines
// @desc    Create a new predefined routine
// @access  Private (Trainer only)
exports.createPredefinedRoutine = async (req, res) => {
  const { name, description, difficulty, exercises } = req.body;

  try {
    const newPredefinedRoutine = new PredefinedRoutine({
      name,
      description,
      difficulty,
      exercises,
    });

    const routine = await newPredefinedRoutine.save();
    res.status(201).json(routine);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getPredefinedRoutines = async (req, res) => {
  try {
    const routines = await PredefinedRoutine.find().populate('exercises');
    res.json(routines);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};