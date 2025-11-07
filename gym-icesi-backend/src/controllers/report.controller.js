const { User, Routine, Trainer, RoutineLog } = require('../models/postgres');
const ProgressTracking = require('../models/mongo/ProgressTracking');
const { Op } = require('sequelize');

// Admin Reports
exports.getAdminOverviewReport = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalTrainers = await Trainer.count();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeUsersCount = await RoutineLog.count({
      distinct: true,
      col: 'user_id',
      where: {
        started_at: {
          [Op.gte]: thirtyDaysAgo,
        },
      },
    });

    res.json({
      totalUsers,
      totalTrainers,
      activeUsersCount,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAdminUserActivityReport = async (req, res) => {
  try {
    const userActivity = await User.findAll({
      attributes: ['username', 'email', 'created_at'],
      include: [{
        model: RoutineLog,
        attributes: ['started_at'],
      }],
      order: [['created_at', 'DESC']],
    });

    const formattedActivity = userActivity.map(user => {
      const totalRoutineLogs = user.RoutineLogs.length;
      const lastActivity = user.RoutineLogs.length > 0 ? user.RoutineLogs[0].started_at : null;
      return {
        username: user.username,
        email: user.email,
        memberSince: user.created_at,
        totalRoutineLogs,
        lastActivity,
      };
    });

    res.json(formattedActivity);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Trainer Reports
exports.getTrainerStudentOverview = async (req, res) => {
  try {
    const trainerId = req.user.id; // Assuming trainer ID is available in req.user

    const assignedStudents = await User.findAll({
      where: { trainerId: trainerId },
      attributes: ['username', 'email'],
      include: [{
        model: RoutineLog,
        attributes: ['id'],
      }],
    });

    const studentsWithRoutineCounts = assignedStudents.map(student => ({
      username: student.username,
      email: student.email,
      totalRoutineLogs: student.RoutineLogs.length,
    }));

    res.json(studentsWithRoutineCounts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getTrainerStudentProgress = async (req, res) => {
  try {
    const trainerId = req.user.id; // Assuming trainer ID is available in req.user

    const assignedStudents = await User.findAll({
      where: { trainerId: trainerId },
      attributes: ['username'],
    });

    const studentUsernames = assignedStudents.map(student => student.username);

    const progressData = await ProgressTracking.aggregate([
      { $match: { user_id: { $in: studentUsernames } } },
      { $group: {
          _id: '$user_id',
          averageCompletion: { $avg: {
            $cond: [
              { $eq: ['$exercises_progress.completion_status', 'completed_totally'] },
              1,
              0
            ]
          } },
          totalProgressEntries: { $sum: 1 }
      }},
      { $lookup: {
          from: 'users', // The collection name for PostgreSQL users (assuming it's 'users')
          localField: '_id',
          foreignField: 'username',
          as: 'userDetails'
      }},
      { $unwind: '$userDetails' },
      { $project: {
          _id: 0,
          username: '$_id',
          email: '$userDetails.email',
          averageCompletion: { $multiply: ['$averageCompletion', 100] }, // Convert to percentage
          totalProgressEntries: 1
      }}
    ]);

    res.json(progressData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// User Reports
exports.getUserConsistencyReport = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available in req.user

    const user = await User.findOne({
      where: { username: userId },
      attributes: ['created_at'],
    });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const routineLogs = await RoutineLog.findAll({
      where: { user_id: userId },
      attributes: ['started_at'],
    });

    const uniqueTrainingDays = new Set(routineLogs.map(log => new Date(log.started_at).toDateString()));
    const totalTrainingDays = uniqueTrainingDays.size;

    const daysSinceJoining = Math.ceil((new Date() - new Date(user.created_at)) / (1000 * 60 * 60 * 24));

    res.json({
      totalTrainingDays,
      daysSinceJoining,
      consistencyPercentage: daysSinceJoining > 0 ? (totalTrainingDays / daysSinceJoining) * 100 : 0,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getUserTotalRoutinesCompleted = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available in req.user

    const totalRoutines = await RoutineLog.count({
      where: { user_id: userId },
    });

    res.json({
      totalRoutinesCompleted: totalRoutines,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
