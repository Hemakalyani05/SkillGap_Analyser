const JobRole = require('../models/JobRole');
const Skill = require('../models/Skill');
const UserSkill = require('../models/UserSkill');
const Recommendation = require('../models/Recommendation');
const User = require('../models/User');
const pdfParse = require('pdf-parse');

// @desc    Save user skills
// @route   POST /api/analysis/user-skills
// @access  Private
const saveUserSkills = async (req, res) => {
  try {
    const { skills } = req.body; // array of skill IDs
    const userId = req.user.id;

    // Clear existing skills
    await UserSkill.deleteMany({ userId });

    // Save new skills
    const userSkillsToSave = skills.map(skillId => ({
      userId,
      skillId,
      proficiencyLevel: 'Beginner' // default
    }));

    await UserSkill.insertMany(userSkillsToSave);
    res.status(200).json({ message: 'User skills saved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Analyze skill gap for a specific job role
// @route   GET /api/analysis/gap/:jobId
// @access  Private
const analyzeSkillGap = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    // 1. Get Job Requirements
    const JobPosting = require('../models/JobPosting');
    let job = await JobPosting.findById(jobId).populate('requiredSkills');
    
    // Fallback to legacy JobRole if not found in JobPosting
    if (!job) {
      job = await JobRole.findById(jobId).populate('requiredSkills');
    }

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    const requiredSkills = job.requiredSkills;

    // 2. Get User Skills
    const userSkillsData = await UserSkill.find({ userId }).populate('skillId');
    const userSkills = userSkillsData.map(us => us.skillId._id.toString());

    // 3. Find Missing Skills
    const missingSkills = requiredSkills.filter(
      (requiredSkill) => !userSkills.includes(requiredSkill._id.toString())
    );

    // Calculate Skill Match Percentage
    const matchedCount = requiredSkills.length - missingSkills.length;
    const matchPercentage = requiredSkills.length === 0 ? 100 : Math.round((matchedCount / requiredSkills.length) * 100);

    // Calculate ATS Score
    // Formula: (Matched Required Skills / Total Required Skills) * 80 + (Extra Skills / Total Available Skills) * 20
    const totalAvailableSkillsCount = await Skill.countDocuments();
    const extraSkillsCount = userSkills.length - matchedCount;
    
    let atsScore = 0;
    if (requiredSkills.length > 0) {
        atsScore += (matchedCount / requiredSkills.length) * 80;
    }
    if (totalAvailableSkillsCount > 0) {
        // Boost score slightly for having extra skills
        atsScore += (extraSkillsCount / totalAvailableSkillsCount) * 20; 
    }
    atsScore = Math.min(100, Math.round(atsScore));

    // 4. Fetch Recommendations for Missing Skills
    const recommendations = [];
    for (const skill of missingSkills) {
      const skillRecommendations = await Recommendation.find({ skillId: skill._id });
      recommendations.push(...skillRecommendations);
    }

    // 5. Find Recommended Alternative Jobs
    const allJobs = await JobRole.find({ _id: { $ne: jobId } }).populate('requiredSkills');
    const recommendedJobs = [];
    
    for (const altJob of allJobs) {
        if (!altJob.requiredSkills || altJob.requiredSkills.length === 0) continue;
        
        const altRequired = altJob.requiredSkills;
        const altMissing = altRequired.filter(
            (reqSkill) => !userSkills.includes(reqSkill._id.toString())
        );
        const altMatchedCount = altRequired.length - altMissing.length;
        const altMatchPercentage = Math.round((altMatchedCount / altRequired.length) * 100);

        if (altMatchPercentage >= matchPercentage) {
            recommendedJobs.push({
                _id: altJob._id,
                roleName: altJob.roleName,
                matchPercentage: altMatchPercentage
            });
        }
    }
    
    // Sort recommended jobs by match percentage descending
    recommendedJobs.sort((a, b) => b.matchPercentage - a.matchPercentage);

    // Save to User History
    const userForHistory = await User.findById(userId);
    const lastHistory = userForHistory.history && userForHistory.history.length > 0 ? userForHistory.history[userForHistory.history.length - 1] : null;
    
    const isDuplicate = lastHistory && 
      lastHistory.jobId && lastHistory.jobId.toString() === job._id.toString() &&
      (Date.now() - new Date(lastHistory.date).getTime()) < 5000;

    if (!isDuplicate) {
      await User.findByIdAndUpdate(userId, {
        $push: {
          history: {
            jobRole: job.title || job.roleName,
            jobId: job._id,
            matchPercentage
          }
        }
      });
    }

    res.status(200).json({
      jobRole: job.title || job.roleName,
      requiredSkills,
      userSkills: userSkillsData.map(us => us.skillId),
      missingSkills,
      matchPercentage,
      atsScore,
      recommendations,
      recommendedJobs
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Parse resume PDF and extract skills
// @route   POST /api/analysis/parse-resume
// @access  Private
const parseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No resume file uploaded' });
    }

    // Parse PDF
    const pdfData = await pdfParse(req.file.buffer);
    const text = pdfData.text;

    // Fetch all skills
    const allSkills = await Skill.find();
    const extractedSkillIds = [];

    // Simple NLP Keyword matching
    allSkills.forEach(skill => {
      // Create a regex to match the skill name (word boundary, case insensitive)
      // Escaping special characters in skill name for regex
      const escapedSkillName = skill.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedSkillName}\\b`, 'i');
      
      if (regex.test(text)) {
        extractedSkillIds.push(skill._id.toString());
      }
    });

    res.status(200).json({
      message: 'Resume parsed successfully',
      extractedSkillIds
    });
  } catch (error) {
    console.error('CRITICAL PDF ERROR:', error);
    res.status(500).json({ message: 'Failed to parse resume: ' + error.message });
  }
};

module.exports = {
  saveUserSkills,
  analyzeSkillGap,
  parseResume
};
