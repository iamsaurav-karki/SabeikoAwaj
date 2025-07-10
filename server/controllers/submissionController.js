const { createSubmission, getAllSubmissions, getSubmissionById } = require('../models/submission');
const { countVotes } = require('../models/vote');

exports.submit = async (req, res) => {
  try {
    const { title, content, department, type } = req.body;
    let userId = null;
    if (req.user) userId = req.user.id;
    if (!title || !content || !department || !type) {
      return res.status(400).json({ error: 'All fields required' });
    }
    const submission = await createSubmission({ title, content, userId, department, type });
    res.status(201).json({ message: 'Submission created', submission });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const submissions = await getAllSubmissions();
    const submissionsWithVotes = await Promise.all(
      submissions.map(async (sub) => {
        try {
          const votes = sub.id ? await countVotes(sub.id) : 0;
          return { ...sub, votes: votes.toString() };
        } catch (e) {
          return { ...sub, votes: '0' };
        }
      })
    );
    res.json(submissionsWithVotes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await getSubmissionById(id);
    if (!submission) return res.status(404).json({ error: 'Not found' });
    res.json(submission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRecent = async (req, res) => {
  try {
    const submissions = await getAllSubmissions();
    // Filter out submissions with invalid or missing createdat
    const validSubs = submissions.filter(s => s.createdat && !isNaN(new Date(s.createdat)));
    // Sort by createdAt desc and take 5
    const sorted = validSubs.sort((a, b) => new Date(b.createdat) - new Date(a.createdat));
    res.json(sorted.slice(0, 5));
  } catch (err) {
    console.error('Error in getRecent:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getRecentResolved = async (req, res) => {
  try {
    const submissions = await getAllSubmissions();
    // Only resolved submissions
    const resolvedSubs = submissions.filter(s => s.status === 'resolved');
    // Sort by updatedAt (if available) or createdAt desc
    const sorted = resolvedSubs.sort((a, b) => {
      const aDate = a.updatedat ? new Date(a.updatedat) : new Date(a.createdat);
      const bDate = b.updatedat ? new Date(b.updatedat) : new Date(b.createdat);
      return bDate - aDate;
    });
    res.json(sorted.slice(0, 5));
  } catch (err) {
    console.error('Error in getRecentResolved:', err);
    res.status(500).json({ error: err.message });
  }
}; 