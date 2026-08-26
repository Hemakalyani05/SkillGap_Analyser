const JobRole = require('../models/JobRole');

// @desc    Get all job roles
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const jobs = await JobRole.find().populate('requiredSkills');
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a job role
// @route   POST /api/jobs
// @access  Private/Admin
const addJob = async (req, res) => {
  try {
    const { roleName, description, requiredSkills } = req.body;
    const job = await JobRole.create({ roleName, description, requiredSkills: requiredSkills || [] });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a job role
// @route   DELETE /api/jobs/:id
// @access  Private/Admin
const deleteJob = async (req, res) => {
  try {
    const job = await JobRole.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getJobs,
  addJob,
  deleteJob
};
