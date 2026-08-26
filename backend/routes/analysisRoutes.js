const express = require('express');
const router = express.Router();
const { saveUserSkills, analyzeSkillGap, parseResume } = require('../controllers/analysisController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/user-skills', protect, saveUserSkills);
router.get('/gap/:jobId', protect, analyzeSkillGap);
router.post('/parse-resume', protect, upload.single('resume'), parseResume);

module.exports = router;
