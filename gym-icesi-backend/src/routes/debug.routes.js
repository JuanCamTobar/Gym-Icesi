const express = require('express');
const router = express.Router();
const { Trainer } = require('../models/postgres');

// @route   GET /debug/trainers
// @desc    Get all trainers
// @access  Public
router.get('/trainers', async (req, res) => {
  try {
    const trainers = await Trainer.findAll();
    res.json(trainers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;