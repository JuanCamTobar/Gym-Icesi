const { Routine, Progress } = require('../models/postgres');

// Get all routines
exports.getRoutines = async (req, res) => {
  try {
    const routines = await Routine.findAll({ where: { user_id: req.user.id } });
    res.json(routines);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a new routine
exports.createRoutine = async (req, res) => {
  const { name } = req.body;
  try {
    const routine = await Routine.create({
      user_id: req.user.id,
      name,
    });
    res.status(201).json(routine);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update routine by ID
exports.updateRoutine = async (req, res) => {
  const { name } = req.body;
  try {
    let routine = await Routine.findByPk(req.params.id);
    if (!routine) {
      return res.status(404).json({ msg: 'Routine not found' });
    }

    if (routine.user_id !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to update this routine' });
    }

    await routine.update({ name });
    res.json(routine);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete routine by ID
exports.deleteRoutine = async (req, res) => {
  try {
    const routine = await Routine.findByPk(req.params.id);
    if (!routine) {
      return res.status(404).json({ msg: 'Routine not found' });
    }

    if (routine.user_id !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to delete this routine' });
    }

    await routine.destroy();
    res.json({ msg: 'Routine removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Register progress for a routine
exports.registerProgress = async (req, res) => {
  const { date, reps, time, effort } = req.body;
  const { id: routine_id } = req.params;

  try {
    const routine = await Routine.findByPk(routine_id);
    if (!routine) {
      return res.status(404).json({ msg: 'Routine not found' });
    }

    if (routine.user_id !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to register progress for this routine' });
    }

    const progress = await Progress.create({
      routine_id,
      date,
      reps,
      time,
      effort,
    });
    res.status(201).json(progress);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
