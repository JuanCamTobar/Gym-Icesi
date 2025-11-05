const mongoose = require('mongoose');

const ProgressTrackingSchema = new mongoose.Schema({
  user_id: {
    type: String, 
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  routine_id: {
    type: String, //
    required: false,
  },
  exercise_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true,
  },
  reps: {
    type: Number,
    required: false,
  },
  sets: {
    type: Number,
    required: false,
  },
  weight: {
    type: Number,
    required: false,
  },
  duration: {
    type: Number, // in minutes or seconds
    required: false,
  },
  effort_level: {
    type: Number, // e.g., 1-10
    required: false,
  },
  notes: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model('ProgressTracking', ProgressTrackingSchema);