const express = require('express');
const router = express.Router();
const { getAll, getById } = require('../controllers/submissionController');
const { voteOnSubmission } = require('../controllers/voteController');
const { authenticate } = require('../middleware/auth');

// GET /api/submissions
router.get('/', getAll);
router.get('/:id', getById);
// New: recent submissions
router.get('/recent', require('../controllers/submissionController').getRecent);
// New: recent resolved submissions
router.get('/recent-resolved', require('../controllers/submissionController').getRecentResolved);

router.post('/:id/vote', authenticate.optional, voteOnSubmission);

module.exports = router; 