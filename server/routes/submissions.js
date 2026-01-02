const express = require('express');
const router = express.Router();
const { getAll, getById, getRecent, getRecentResolved } = require('../controllers/submissionController');
const { voteOnSubmission } = require('../controllers/voteController');
const { authenticate } = require('../middleware/auth');

// IMPORTANT: Specific routes must come before parameterized routes
// GET /api/submissions
router.get('/', getAll);
// Recent submissions (must come before /:id)
router.get('/recent', getRecent);
// Recent resolved submissions (must come before /:id)
router.get('/recent-resolved', getRecentResolved);
// Get by ID (must come after specific routes)
router.get('/:id', getById);
// Vote on submission
router.post('/:id/vote', authenticate.optional, voteOnSubmission);

module.exports = router; 