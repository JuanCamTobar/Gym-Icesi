const { User, Student, Employee, StatisticsTrainer } = require('../models/postgres');
const bcrypt = require('bcryptjs');

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password_hash'] },
      include: [Student, Employee]
    });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.assignTrainer = async (req, res) => {
  const { username } = req.params;
  const { trainerId } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.trainerId = trainerId;
    await user.save();

    // Update trainer statistics
    const month = new Date().toISOString().slice(0, 7); // Format: YYYY-MM
    const [stats, created] = await StatisticsTrainer.findOrCreate({
      where: { trainer_id: trainerId, month: month },
      defaults: { new_assignments: 1, followups: 0 }
    });

    if (!created) {
      stats.new_assignments += 1;
      await stats.save();
    }

    res.json({ msg: 'Trainer assigned successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

