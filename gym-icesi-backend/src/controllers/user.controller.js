const { User, Student, Employee } = require('../models/postgres');
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

    res.json({ msg: 'Trainer assigned successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

