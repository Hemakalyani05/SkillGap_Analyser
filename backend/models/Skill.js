const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String, // e.g., 'Frontend', 'Backend', 'Database', 'Soft Skills'
    required: true
  }
});

module.exports = mongoose.model('Skill', skillSchema);
