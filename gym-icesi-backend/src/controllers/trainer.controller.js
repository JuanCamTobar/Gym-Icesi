const { Trainer, User } = require('../models/postgres');

// Get all trainers
exports.getTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.findAll();
    res.json(trainers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a new trainer
exports.createTrainer = async (req, res) => {
  const { name, specialization } = req.body;
  try {
    const trainer = await Trainer.create({
      name,
      specialization,
    });
    res.status(201).json(trainer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update trainer by ID
exports.updateTrainer = async (req, res) => {
  const { name, specialization } = req.body;
  try {
    let trainer = await Trainer.findByPk(req.params.id);
    if (!trainer) {
      return res.status(404).json({ msg: 'Trainer not found' });
    }

    await trainer.update({ name, specialization });
    res.json(trainer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete trainer by ID
exports.deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByPk(req.params.id);
    if (!trainer) {
      return res.status(404).json({ msg: 'Trainer not found' });
    }

    await trainer.destroy();
    res.json({ msg: 'Trainer removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get users assigned to a trainer
exports.getTrainerUsers = async (req, res) => {
  try {
    const trainer = await Trainer.findByPk(req.params.id);
    if (!trainer) {
      return res.status(404).json({ msg: 'Trainer not found' });
    }

    // Assuming users have a trainer_id field or a many-to-many relationship
    // For now, let's assume a user has a 'trainerId' field if assigned
    const users = await User.findAll({ where: { trainerId: req.params.id }, attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
