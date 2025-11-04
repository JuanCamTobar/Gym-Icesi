const { Progress, Routine, User } = require('../models/postgres');

// Get progress for a specific user
exports.getProgressByUser = async (req, res) => {
  try {
    const { id: userId } = req.params;

    // Ensure the requesting user is authorized to view this progress
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ msg: 'Not authorized to view this users progress' });
    }

    const routines = await Routine.findAll({
      where: { user_id: userId },
      include: [{
        model: Progress,
        attributes: ['date', 'reps', 'time', 'effort'],
      }],
    });

    res.json(routines);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get progress for a specific routine
exports.getProgressByRoutine = async (req, res) => {
  try {
    const { id: routineId } = req.params;

    const routine = await Routine.findByPk(routineId);
    if (!routine) {
      return res.status(404).json({ msg: 'Routine not found' });
    }

    // Ensure the requesting user is authorized to view this routine's progress
    if (req.user.role !== 'admin' && req.user.id !== routine.user_id) {
      return res.status(403).json({ msg: 'Not authorized to view this routines progress' });
    }

    const progress = await Progress.findAll({
      where: { routine_id: routineId },
      order: [['date', 'ASC']],
    });

    res.json(progress);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
