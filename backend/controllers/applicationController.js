const Application = require('../models/Application');
const JobPosting = require('../models/JobPosting');
const UserSkill = require('../models/UserSkill');

// @desc    Apply for a job (Candidate)
// @route   POST /api/applications/:jobId
// @access  Private (Candidate only)
const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const candidateId = req.user.id;

    // Check if already applied
    const existingApp = await Application.findOne({ jobId, candidateId });
    if (existingApp) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const job = await JobPosting.findById(jobId).populate('requiredSkills');
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Calculate AI Match Score instantly
    const userSkillsData = await UserSkill.find({ userId: candidateId }).populate('skillId');
    if (userSkillsData.length === 0) {
      return res.status(400).json({ message: 'Please build your skill profile or upload a resume in the Dashboard before applying to jobs.' });
    }

    const userSkills = userSkillsData.map(us => us.skillId._id.toString());
    
    let matchPercentage = 100;
    if (job.requiredSkills.length > 0) {
      const missingSkills = job.requiredSkills.filter(
        (reqSkill) => !userSkills.includes(reqSkill._id.toString())
      );
      const matchedCount = job.requiredSkills.length - missingSkills.length;
      matchPercentage = Math.round((matchedCount / job.requiredSkills.length) * 100);
    }

    const application = await Application.create({
      jobId,
      candidateId,
      matchScore: matchPercentage
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get candidate's own applications
// @route   GET /api/applications/my-applications
// @access  Private (Candidate only)
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidateId: req.user.id }).populate('jobId');
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get applicants for a specific job (Recruiter ATS view)
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter only)
const getApplicantsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Verify job belongs to recruiter
    const job = await JobPosting.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.recruiterId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to view these applicants' });
    }

    // Sort by matchScore descending (AI ranking)
    const applicants = await Application.find({ jobId })
      .populate('candidateId', 'name email avatar')
      .sort({ matchScore: -1 });

    res.status(200).json(applicants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status (Move applicant in ATS pipeline)
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter only)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate('jobId');
    
    if (!application) return res.status(404).json({ message: 'Application not found' });
    if (application.jobId.recruiterId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    application.status = status;
    await application.save();

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus
};
