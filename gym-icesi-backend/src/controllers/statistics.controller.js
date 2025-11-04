const { StatisticsUser, StatisticsTrainer } = require('../models/postgres');

// Get user statistics for a specific month
exports.getUserStatistics = async (req, res) => {
  try {
    const { month } = req.params;
    const stats = await StatisticsUser.findAll({ where: { month } });
    res.json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get trainer statistics for a specific month
exports.getTrainerStatistics = async (req, res) => {
  try {
    const { month } = req.params;
    const stats = await StatisticsTrainer.findAll({ where: { month } });
    res.json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
