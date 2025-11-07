const { RoutineLog, StatisticsTrainer, User } = require('../models/postgres');
const ProgressTracking = require('../models/mongo/ProgressTracking');
const { Op, fn, col, literal } = require('sequelize');

// @desc    Get started routines for the logged-in user, grouped by month
// @route   GET /api/statistics/user/routines
// @access  Private
exports.getUserStartedRoutines = async (req, res) => {
  try {
    const logs = await RoutineLog.findAll({
      where: { user_id: req.user.id },
      order: [['started_at', 'DESC']],
    });

    // Group by month
    const groupedByMonth = logs.reduce((acc, log) => {
      const month = log.started_at.toISOString().slice(0, 7); // YYYY-MM
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(log);
      return acc;
    }, {});

    res.json(groupedByMonth);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get progress calendar data for the logged-in user for a specific month
// @route   GET /api/statistics/user/progress-calendar?month=YYYY-MM
// @access  Private
exports.getUserProgressCalendar = async (req, res) => {
  const { month } = req.query; // e.g., 2023-10
  if (!month) {
    return res.status(400).json({ msg: 'Month query parameter is required' });
  }

  try {
    const startDate = new Date(`${month}-01T00:00:00.000Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    const progressEntries = await ProgressTracking.find({
      user_id: req.user.id,
      date: { $gte: startDate, $lt: endDate },
    }).select('date');

    const daysWithProgress = new Set(progressEntries.map(p => p.date.toISOString().slice(0, 10)));
    const daysInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();

    const daysWithoutProgress = daysInMonth - daysWithProgress.size;

    res.json({
      daysWithProgress: daysWithProgress.size,
      daysWithoutProgress: daysWithoutProgress,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get statistics for the logged-in trainer
// @route   GET /api/statistics/trainer/my-stats
// @access  Private (Trainer)
exports.getTrainerStats = async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.user.id } });
    if (!user || !user.employee_id) {
      return res.status(404).json({ msg: 'Trainer not found' });
    }

    const trainer = await Trainer.findOne({ where: { employee_id: user.employee_id } });
    if (!trainer) {
      return res.status(404).json({ msg: 'Trainer not found' });
    }

    const stats = await StatisticsTrainer.findAll({
      where: { trainer_id: trainer.id },
      order: [['month', 'DESC']],
    });

    res.json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get aggregated stats for the admin dashboard
// @route   GET /api/statistics/admin/overview
// @access  Private (Admin)
exports.getAdminOverview = async (req, res) => {
  try {
    // 1. Total routines started per month
    const routineStats = await RoutineLog.findAll({
      attributes: [
        [fn('to_char', col('started_at'), 'YYYY-MM'), 'month'],
        [fn('COUNT', col('id')), 'totalRoutines'],
      ],
      group: ['month'],
      order: [[literal('month'), 'DESC']],
    });

    // 2. Total new assignments per month
    const assignmentStats = await StatisticsTrainer.findAll({
      attributes: [
        'month',
        [fn('SUM', col('new_assignments')), 'totalAssignments'],
      ],
      group: ['month'],
      order: [[literal('month'), 'DESC']],
    });

    // 3. Total follow-ups (comments) by trainers per month
    const followupStats = await StatisticsTrainer.findAll({
      attributes: [
        'month',
        [fn('SUM', col('followups')), 'totalFollowups'],
      ],
      group: ['month'],
      order: [[literal('month'), 'DESC']],
    });

    res.json({
      routines: routineStats,
      assignments: assignmentStats,
      followups: followupStats,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};