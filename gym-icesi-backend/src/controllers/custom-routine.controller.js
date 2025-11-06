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
// @route   GET /api/custom-routines/:id
// @desc    Get a single custom routine by ID
// @access  Private
exports.getCustomRoutineById = async (req, res) => {
  try {
    const routine = await CustomRoutine.findById(req.params.id).populate('exercises.exercise_id');

    if (!routine) {
      return res.status(404).json({ msg: 'Routine not found' });
    }

    // Ensure the routine belongs to the authenticated user
    if (routine.user_id !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    res.json(routine);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Routine not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @route   PUT /api/custom-routines/:id
// @desc    Update a custom routine
// @access  Private
exports.updateCustomRoutine = async (req, res) => {
  const { name, exercises } = req.body;
  const userId = req.user.id;

  try {
    let routine = await CustomRoutine.findById(req.params.id);

    if (!routine) {
      return res.status(404).json({ msg: 'Routine not found' });
    }

    // Ensure the routine belongs to the authenticated user
    if (routine.user_id !== userId) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    routine.name = name || routine.name;
    routine.exercises = exercises.map(ex => ({
      exercise_id: ex.exercise_id,
      sets: ex.sets,
      reps: ex.reps,
      duration: ex.duration,
      weight: ex.weight,
    }));

    await routine.save();
    res.json(routine);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Routine not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @route   DELETE /api/custom-routines/:id
// @desc    Delete a custom routine
// @access  Private
exports.deleteCustomRoutine = async (req, res) => {
  const userId = req.user.id;

  try {
    const routine = await CustomRoutine.findById(req.params.id);

    if (!routine) {
      return res.status(404).json({ msg: 'Routine not found' });
    }

    // Ensure the routine belongs to the authenticated user
    if (routine.user_id !== userId) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await CustomRoutine.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Routine removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Routine not found' });
    }
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

// @route   GET /api/custom-routines/student/:studentUsername
// @desc    Get all custom routines for a specific student
// @access  Private (Instructor authorized to view this student)
exports.getCustomRoutinesByStudent = async (req, res) => {
  const { studentUsername } = req.params;

  try {
    const routines = await CustomRoutine.find({ user_id: studentUsername }).populate('exercises.exercise_id');
    res.json(routines);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};