const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  skillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  resourceTitle: {
    type: String,
    required: true
  },
  resourceLink: {
    type: String,
    required: true
  },
  type: {
    type: String, // e.g., 'Video', 'Course', 'Article'
    default: 'Course'
  }
});

module.exports = mongoose.model('Recommendation', recommendationSchema);
