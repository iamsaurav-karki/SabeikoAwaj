const { getAllSubmissions, getSubmissionById, updateSubmission, deleteSubmission, updateSubmissionStatus, updateSubmissionDepartment } = require('../models/submission');
const { countVotes } = require('../models/vote');
const client = require('../db/scylla');

exports.getStats = async (req, res) => {
  try {
    const submissions = await getAllSubmissions();
    const total = submissions.length;
    const resolved = submissions.filter(s => s.status === 'resolved').length;
    const inProgress = submissions.filter(s => s.status === 'pending' || s.status === 'in progress').length;
    const usersResult = await client.execute('SELECT COUNT(*) FROM users');
    const activeUsers = usersResult.rows[0]['count'] || 0;
    res.json({ total, resolved, inProgress, activeUsers });
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
    res.json(submissionsWithVotes.sort((a, b) => new Date(b.createdat) - new Date(a.createdat)));
  } catch (err) {
    res.status(500).json({ error: 'A server error occurred while fetching submissions.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await getSubmissionById(id);
    if (!submission) return res.status(404).json({ error: 'Not found' });
    
    const votes = await countVotes(id);
    submission.votes = votes.toString();
    
    res.json(submission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, department } = req.body;
    if (!title || !content || !department) {
      return res.status(400).json({ error: 'Title, content, and department are required' });
    }
    await updateSubmission(id, { title, content, department });
    res.json({ message: 'Submission updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteSubmission(id);
    res.json({ message: 'Submission deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.assign = async (req, res) => {
  try {
    const { id } = req.params;
    const { department } = req.body;
    if (!department) {
      return res.status(400).json({ error: 'Department is required' });
    }
    await updateSubmissionDepartment(id, department);
    res.json({ message: 'Submission assigned successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    await updateSubmissionStatus(id, status);
    res.json({ message: 'Status updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 