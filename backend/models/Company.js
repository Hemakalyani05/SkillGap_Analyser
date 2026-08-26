const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
  },
  location: {
    type: String,
  },
  description: {
    type: String,
  },
  logo: {
    type: String, // URL to logo
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Company', CompanySchema);
