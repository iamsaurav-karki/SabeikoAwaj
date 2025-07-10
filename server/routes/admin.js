const express = require('express');
const router = express.Router();
const { getStats, getAll, getById, update, remove, assign, updateStatus } = require('../controllers/adminController');
const { authenticate, isAdmin } = require('../middleware/auth');

// GET /api/admin
router.get('/', (req, res) => {
  res.json({ message: 'Admin endpoint' });
});

// New: platform statistics
router.get('/stats', getStats);

// GET all submissions (admin)
router.get('/submissions', authenticate.required, isAdmin, getAll);
// GET submission by id (admin)
router.get('/submissions/:id', authenticate.required, isAdmin, getById);
// PUT update submission (admin)
router.put('/submissions/:id', authenticate.required, isAdmin, update);
// DELETE submission (admin)
router.delete('/submissions/:id', authenticate.required, isAdmin, remove);
// POST assign submission (admin)
router.post('/submissions/:id/assign', authenticate.required, isAdmin, assign);
// POST update status (admin)
router.post('/submissions/:id/status', authenticate.required, isAdmin, updateStatus);

module.exports = router; 