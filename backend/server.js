require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Connect to Database
connectDB();

const app = express();

// Security Middleware
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

app.use('/api', limiter);

// CORS


// Handle preflight requests
app.options(/.*/, cors({
  origin: 'https://profound-creativity-production-743c.up.railway.app',
  credentials: true
}));
// Parse JSON requests
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.send('Skill Gap Analysis API is running...');
});

// Import Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/skills', require('./routes/skillRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/analysis', require('./routes/analysisRoutes'));
app.use('/api/job-postings', require('./routes/jobPostingRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});