const express = require('express');
const router = express.Router();
const { submit } = require('../controllers/submissionController');
const { authenticate } = require('../middleware/auth');

// Allow both anonymous and authenticated submissions
router.post('/', authenticate.optional, submit);

module.exports = router; 