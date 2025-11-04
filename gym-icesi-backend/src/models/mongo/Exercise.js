const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: false,
  },
  difficulty: {
    type: String,
    required: true,
  },
  video_url: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
