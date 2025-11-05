const Exercise = require('../models/mongo/Exercise');
const PredefinedRoutine = require('../models/mongo/PredefinedRoutine');

exports.getPredefinedRoutines = async (req, res) => {
  try {
    const routines = await PredefinedRoutine.find().populate('exercises');
    res.json(routines);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};