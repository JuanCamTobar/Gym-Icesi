const mongoose = require('mongoose');

const CustomRoutineSchema = new mongoose.Schema({
  user_id: {
    type: String, 
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  exercises: [
    {
      exercise_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true,
      },
      sets: { type: Number, required: false },
      reps: { type: Number, required: false },
      duration: { type: Number, required: false }, 
      weight: { type: Number, required: false },
    },
  ],
  difficulty: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('CustomRoutine', CustomRoutineSchema);