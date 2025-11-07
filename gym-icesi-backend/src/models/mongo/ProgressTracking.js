const mongoose = require('mongoose');

const ProgressTrackingSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  routine_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomRoutine',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  exercises_progress: [
    {
      exercise_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true,
      },
      completion_status: {
        type: String,
        enum: ['completed_totally', 'different_completion', 'not_completed'],
        default: 'not_completed',
      },
      sets: { type: Number },
      reps: { type: Number },
      weight: { type: Number },
      duration: { type: Number }, // in minutes
      notes: { type: String },
    },
  ],
  comments: [
    {
      comment: { type: String },
      trainer_id: { type: String },
      trainer_name: { type: String },
      date: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model('ProgressTracking', ProgressTrackingSchema);