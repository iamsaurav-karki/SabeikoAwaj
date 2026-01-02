const { getAllSubmissions, getSubmissionById, updateSubmission, deleteSubmission, updateSubmissionStatus, updateSubmissionDepartment } = require('../models/submission');
const { countVotes } = require('../models/vote');
const client = require('../db/scylla');

exports.getStats = async (req, res) => {
  try {
    const submissions = await getAllSubmissions();
    const total = submissions.length;
    const resolved = submissions.filter(s => s.status && s.status.toLowerCase() === 'resolved').length;
    const inProgress = submissions.filter(s => {
      const status = s.status ? s.status.toLowerCase() : '';
      return status === 'pending' || status === 'in progress';
    }).length;
    
    let activeUsers = 0;
    try {
      const usersResult = await client.execute('SELECT COUNT(*) FROM users');
      activeUsers = usersResult.rows[0] && usersResult.rows[0]['count'] ? parseInt(usersResult.rows[0]['count']) : 0;
    } catch (userErr) {
      console.error('Error counting users:', userErr);
      // Continue with 0 if user count fails
    }
    
    res.json({ total, resolved, inProgress, activeUsers });
  } catch (err) {
    console.error('Error in getStats:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch statistics' });
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
    // Sort by createdat, handling both Date objects and timestamps
    const sorted = submissionsWithVotes.sort((a, b) => {
      const aDate = a.createdat || a.createdAt;
      const bDate = b.createdat || b.createdAt;
      
      if (!aDate && !bDate) return 0;
      if (!aDate) return 1;
      if (!bDate) return -1;
      
      const aTime = aDate instanceof Date ? aDate.getTime() : new Date(aDate).getTime();
      const bTime = bDate instanceof Date ? bDate.getTime() : new Date(bDate).getTime();
      
      if (isNaN(aTime) || isNaN(bTime)) return 0;
      
      return bTime - aTime;
    });
    res.json(sorted);
  } catch (err) {
    console.error('Error in admin getAll:', err);
    res.status(500).json({ error: err.message || 'A server error occurred while fetching submissions.' });
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