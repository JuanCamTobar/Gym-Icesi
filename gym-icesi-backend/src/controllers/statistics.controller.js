const { RoutineLog, StatisticsTrainer, User, Trainer } = require('../models/postgres');
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
    // 1. Routines started per day, grouped by month
    const routineStats = await RoutineLog.findAll({
      attributes: [
        [fn('to_char', col('started_at'), 'YYYY-MM'), 'month'],
        [fn('EXTRACT', literal('DAY FROM started_at')), 'day'],
        [fn('COUNT', col('id')), 'count'],
      ],
      group: ['month', 'day'],
      order: [[literal('month'), 'DESC']],
      raw: true,
    });

    // 2. New assignments per day, grouped by month
    const assignmentStats = await User.findAll({
      attributes: [
        [fn('to_char', col('trainerAssignedAt'), 'YYYY-MM'), 'month'],
        [fn('EXTRACT', literal('DAY FROM "trainerAssignedAt"')), 'day'],
        [fn('COUNT', col('username')), 'count'],
      ],
      where: { trainerId: { [Op.ne]: null } }, // Count only users that have a trainer
      group: ['month', 'day'],
      order: [[literal('month'), 'DESC']],
      raw: true,
    });

    // 3. Follow-ups (comments) by trainers per day, grouped by month
    const followupEntries = await ProgressTracking.aggregate([
      { $match: { trainer_comment: { $ne: null, $ne: '' } } },
      {
        $group: {
          _id: {
            month: { $dateToString: { format: '%Y-%m', date: '$date' } },
            day: { $dayOfMonth: '$date' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.month': -1, '_id.day': 1 } },
    ]);

    // Helper to group daily counts by month
    const groupDailyCounts = (stats) => {
      const result = {};
      stats.forEach(stat => {
        const { month, day, count } = stat;
        if (!result[month]) {
          result[month] = { month, dailyCounts: [] };
        }
        // Ensure day is an integer
        result[month].dailyCounts.push({ day: parseInt(day, 10), count: parseInt(count, 10) });
      });
      return Object.values(result);
    };

    const routines = groupDailyCounts(routineStats);
    const assignments = groupDailyCounts(assignmentStats);
    // Adapt MongoDB aggregation result to the expected format
    const followups = groupDailyCounts(followupEntries.map(item => ({
      month: item._id.month,
      day: item._id.day,
      count: item.count,
    })));


    res.json({
      routines: routines,
      assignments: assignments,
      followups: followups,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};