const express = require('express');
const router = express.Router();
const { getJobs, addJob, deleteJob } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getJobs);
router.post('/', protect, authorize('recruiter'), addJob);
router.delete('/:id', protect, authorize('recruiter'), deleteJob);

module.exports = router;
