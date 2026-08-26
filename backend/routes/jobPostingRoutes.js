const express = require('express');
const router = express.Router();
const { 
  getJobPostings, 
  getMyJobPostings, 
  createJobPosting, 
  deleteJobPosting,
  getAnalytics
} = require('../controllers/jobPostingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getJobPostings); // Candidates can view
router.get('/my-postings', protect, authorize('recruiter'), getMyJobPostings);
router.get('/analytics/stats', protect, authorize('recruiter'), getAnalytics);
router.post('/', protect, authorize('recruiter'), createJobPosting);
router.delete('/:id', protect, authorize('recruiter'), deleteJobPosting);

module.exports = router;
