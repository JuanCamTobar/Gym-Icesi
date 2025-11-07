const ProgressTracking = require('../models/mongo/ProgressTracking');
const CustomRoutine = require('../models/mongo/CustomRoutine');
const User = require('../models/postgres').User;
const Employee = require('../models/postgres').Employee;

// @route   POST /api/progress
// @desc    Record daily progress for a routine
// @access  Private
exports.recordDailyProgress = async (req, res) => {
  const { routine_id, date, exercises_progress } = req.body;
  const userId = req.user.id;

  try {
    // Check if the routine exists and belongs to the user
    const routine = await CustomRoutine.findById(routine_id);
    if (!routine || routine.user_id !== userId) {
      return res.status(404).json({ msg: 'Routine not found or not authorized' });
    }

    // Create a new progress tracking entry
    const newProgress = new ProgressTracking({
      user_id: userId,
      routine_id,
      date: new Date(date),
      exercises_progress,
    });

    await newProgress.save();
    res.status(201).json(newProgress);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET /api/progress/routine/:routineId
// @desc    Get progress for a specific routine by the authenticated user
// @access  Private
exports.getProgressByRoutine = async (req, res) => {
  const { routineId } = req.params;
  const userId = req.user.id;

  try {
    // Check if the routine exists and belongs to the user
    const routine = await CustomRoutine.findById(routineId);
    if (!routine || routine.user_id !== userId) {
      return res.status(404).json({ msg: 'Routine not found or not authorized' });
    }

    const progressData = await ProgressTracking.find({ routine_id: routineId, user_id: userId })
      .populate({
        path: 'exercises_progress.exercise_id',
        model: 'Exercise',
      })
      .sort({ date: 1 }); // Sort by date ascending

    res.json(progressData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET /api/progress/routine/:routineId/student/:studentUsername
// @desc    Get progress for a specific routine and student
// @access  Private (Instructor authorized to view this student)
exports.getProgressByRoutineAndStudent = async (req, res) => {
  const { routineId, studentUsername } = req.params;

  try {
    // Check if the routine exists and belongs to the student
    const routine = await CustomRoutine.findById(routineId);
    if (!routine || routine.user_id !== studentUsername) {
      return res.status(404).json({ msg: 'Routine not found or not authorized for this student' });
    }

    const progressData = await ProgressTracking.find({ routine_id: routineId, user_id: studentUsername })
      .populate({
        path: 'exercises_progress.exercise_id',
        model: 'Exercise',
      })
      .sort({ date: 1 }); // Sort by date ascending

    res.json(progressData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   POST /api/progress/:id/comment
// @desc    Add a comment to a progress tracking entry
// @access  Private (Trainer)
exports.addComment = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const trainerId = req.user.id; // Assuming the authenticated user is a trainer

  try {
    const progress = await ProgressTracking.findById(id);

    if (!progress) {
      return res.status(404).json({ msg: 'Progress entry not found' });
    }

    let trainerName = trainerId;
    const user = await User.findOne({ where: { username: trainerId } });

    if (user && user.employee_id) {
      const employee = await Employee.findByPk(user.employee_id);
      if (employee) {
        trainerName = `${employee.first_name} ${employee.last_name}`;
      }
    }

    const newComment = {
      comment,
      trainer_id: trainerId,
      trainer_name: trainerName,
    };

    progress.comments.push(newComment);

    await progress.save();

    res.json(progress);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};