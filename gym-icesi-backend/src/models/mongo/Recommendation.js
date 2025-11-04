const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema({
  user_id: {
    type: String, // Storing as String as it's a UUID from PostgreSQL
    required: true,
  },
  trainer_id: {
    type: String, // Storing as String as it's a UUID from PostgreSQL
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Recommendation', RecommendationSchema);
