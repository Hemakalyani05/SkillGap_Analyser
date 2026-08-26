const express = require('express');
const router = express.Router();
const { 
  applyForJob, 
  getMyApplications, 
  getApplicantsForJob, 
  updateApplicationStatus 
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/:jobId', protect, authorize('candidate', 'user'), applyForJob);
router.get('/my-applications', protect, authorize('candidate', 'user'), getMyApplications);
router.get('/job/:jobId', protect, authorize('recruiter'), getApplicantsForJob);
router.put('/:id/status', protect, authorize('recruiter'), updateApplicationStatus);

module.exports = router;
