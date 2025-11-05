const CustomRoutine = require('../models/mongo/CustomRoutine');
const PredefinedRoutine = require('../models/mongo/PredefinedRoutine');

// @route   POST /api/custom-routines
// @desc    Create a new custom routine
// @access  Private
exports.createCustomRoutine = async (req, res) => {
  const { name, exercises } = req.body;
  const userId = req.user.id;

  try {
    const newCustomRoutine = new CustomRoutine({
      user_id: userId,
      name,
      exercises: exercises.map(ex => ({
        exercise_id: ex.exercise_id,
        sets: ex.sets,
        reps: ex.reps,
        duration: ex.duration,
        weight: ex.weight,
      })),
    });

    const routine = await newCustomRoutine.save();
    res.status(201).json(routine);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.adoptPredefinedRoutine = async (req, res) => {
  const { predefinedRoutineId } = req.body;
  const userId = req.user.id; // Assuming you have the user ID from the auth middleware

  try {
    const predefinedRoutine = await PredefinedRoutine.findById(predefinedRoutineId).populate('exercises');

    if (!predefinedRoutine) {
      return res.status(404).json({ msg: 'Predefined routine not found' });
    }

    const newCustomRoutine = new CustomRoutine({
      user_id: userId,
      name: predefinedRoutine.name,
      exercises: predefinedRoutine.exercises.map(exercise => ({
        exercise_id: exercise._id,
      })),
      difficulty: predefinedRoutine.difficulty,
      description: predefinedRoutine.description,
    });

    await newCustomRoutine.save();

    res.json(newCustomRoutine);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getCustomRoutines = async (req, res) => {
  const userId = req.user.id; // Assuming you have the user ID from the auth middleware

  try {
    const routines = await CustomRoutine.find({ user_id: userId }).populate('exercises.exercise_id');
    res.json(routines);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};