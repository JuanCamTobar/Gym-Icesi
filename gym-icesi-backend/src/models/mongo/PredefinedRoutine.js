const mongoose = require('mongoose');

const PredefinedRoutineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  exercises: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
    },
  ],
  difficulty: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('PredefinedRoutine', PredefinedRoutineSchema);
