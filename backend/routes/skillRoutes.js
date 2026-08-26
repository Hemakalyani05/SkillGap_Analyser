const express = require('express');
const router = express.Router();
const { getSkills, addSkill, deleteSkill } = require('../controllers/skillController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getSkills);
router.post('/', protect, authorize('recruiter'), addSkill);
router.delete('/:id', protect, authorize('recruiter'), deleteSkill);

module.exports = router;
