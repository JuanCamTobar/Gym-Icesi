const { User, Routine, Trainer } = require('../models/postgres');
const { Op } = require('sequelize');

// Get top users based on number of routines completed or progress entries
exports.getTopUsers = async (req, res) => {
  try {
    // This is a simplified example. A real-world scenario would involve more complex aggregation.
    const topUsers = await User.findAll({
      attributes: ['id', 'name', 'email'],
      include: [{
        model: Routine,
        attributes: [],
      }],
      group: ['User.id'],
      order: [[Routine, 'id', 'DESC']], // Order by number of routines (proxy for activity)
      limit: 10,
    });
    res.json(topUsers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get trainer performance (e.g., number of assigned users, average user progress)
exports.getTrainerPerformance = async (req, res) => {
  try {
    // This is a simplified example. A real-world scenario would involve more complex aggregation.
    const trainerPerformance = await Trainer.findAll({
      attributes: ['id', 'name', 'specialization'],
      include: [{
        model: User,
        attributes: ['id', 'name', 'email'],
      }],
    });
    res.json(trainerPerformance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
