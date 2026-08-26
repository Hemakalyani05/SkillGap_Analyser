const JobPosting = require('../models/JobPosting');

// @desc    Get all active job postings (For Candidates to browse)
// @route   GET /api/job-postings
// @access  Private
const getJobPostings = async (req, res) => {
  try {
    const jobs = await JobPosting.find({ status: 'Active' }).populate('requiredSkills');
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get job postings by the logged-in recruiter
// @route   GET /api/job-postings/my-postings
// @access  Private (Recruiter only)
const getMyJobPostings = async (req, res) => {
  try {
    const jobs = await JobPosting.find({ recruiterId: req.user.id }).populate('requiredSkills');
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new job posting
// @route   POST /api/job-postings
// @access  Private (Recruiter only)
const createJobPosting = async (req, res) => {
  try {
    const { title, description, requiredSkills, experienceLevel, location, salaryRange } = req.body;
    
    const job = await JobPosting.create({
      recruiterId: req.user.id,
      title,
      description,
      requiredSkills,
      experienceLevel,
      location,
      salaryRange
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a job posting
// @route   DELETE /api/job-postings/:id
// @access  Private (Recruiter only)
const deleteJobPosting = async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    if (job.recruiterId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await job.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recruiter analytics
// @route   GET /api/job-postings/analytics/stats
// @access  Private (Recruiter only)
const getAnalytics = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    
    // Total Postings
    const totalPostings = await JobPosting.countDocuments({ recruiterId });
    
    // Active Postings
    const activePostings = await JobPosting.countDocuments({ recruiterId, status: 'Active' });

    // Applications Received
    const Application = require('../models/Application');
    // Find all jobs by this recruiter
    const myJobs = await JobPosting.find({ recruiterId }).select('_id');
    const myJobIds = myJobs.map(job => job._id);
    
    const totalApplications = await Application.countDocuments({ jobId: { $in: myJobIds } });
    const hiredApplications = await Application.countDocuments({ jobId: { $in: myJobIds }, status: 'Hired' });
    
    const conversionRate = totalApplications === 0 ? 0 : Math.round((hiredApplications / totalApplications) * 100);

    // Mock Time to Hire (in days)
    const timeToHire = hiredApplications === 0 ? 0 : 14;

    res.status(200).json({
      totalPostings,
      activePostings,
      totalApplications,
      conversionRate,
      timeToHire,
      hiredCount: hiredApplications
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getJobPostings,
  getMyJobPostings,
  createJobPosting,
  deleteJobPosting,
  getAnalytics
};
