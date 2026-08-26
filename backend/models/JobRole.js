const mongoose = require('mongoose');

const jobRoleSchema = new mongoose.Schema({
  roleName: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  requiredSkills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill'
  }]
});

module.exports = mongoose.model('JobRole', jobRoleSchema);
