const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    enum: ['Fuerza', 'Cardio', 'Flexibilidad', 'Equilibrio', 'Otro'],
    required: true,
  },
  duration: {
    type: String,
    trim: true,
  },
  difficulty: {
    type: String,
    enum: ['Principiante', 'Intermedio', 'Avanzado'],
    trim: true,
  },
  video_url: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Exercise', ExerciseSchema);