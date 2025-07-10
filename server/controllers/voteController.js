const { addVote } = require('../models/vote');
const { v4: uuidv4 } = require('uuid');

exports.voteOnSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    let userId = null;
    if (req.user && req.user.id) {
      userId = req.user.id;
    } else {
      // For anonymous, generate a random UUID per session (not ideal, but allows voting)
      userId = req.headers['x-anon-id'] || uuidv4();
    }
    await addVote(id, userId);
    res.json({ message: 'Vote recorded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 