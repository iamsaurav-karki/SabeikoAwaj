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
    if (!submissions || submissions.length === 0) {
      return res.json([]);
    }
    
    // Filter out submissions with invalid or missing createdat (handle both camelCase and lowercase)
    const validSubs = submissions.filter(s => {
      const date = s.createdat || s.createdAt;
      if (!date) return false;
      // If it's already a Date object, check if it's valid
      if (date instanceof Date) {
        return !isNaN(date.getTime());
      }
      // Otherwise, try to parse it
      try {
        const parsed = new Date(date);
        return !isNaN(parsed.getTime());
      } catch (e) {
        return false;
      }
    });
    
    if (validSubs.length === 0) {
      return res.json([]);
    }
    
    // Sort by createdAt desc and take 5
    const sorted = validSubs.sort((a, b) => {
      try {
        const aDate = a.createdat || a.createdAt;
        const bDate = b.createdat || b.createdAt;
        const aTime = aDate instanceof Date ? aDate.getTime() : new Date(aDate).getTime();
        const bTime = bDate instanceof Date ? bDate.getTime() : new Date(bDate).getTime();
        if (isNaN(aTime) || isNaN(bTime)) return 0;
        return bTime - aTime;
      } catch (e) {
        return 0;
      }
    });
    
    // Add votes to each submission
    const submissionsWithVotes = await Promise.all(
      sorted.slice(0, 5).map(async (sub) => {
        try {
          const votes = sub.id ? await countVotes(sub.id) : 0;
          return { ...sub, votes: votes.toString() };
        } catch (e) {
          console.error('Error counting votes for submission', sub.id, ':', e);
          return { ...sub, votes: '0' };
        }
      })
    );
    
    res.json(submissionsWithVotes);
  } catch (err) {
    console.error('Error in getRecent:', err);
    // Return empty array instead of error to prevent frontend crashes
    res.status(200).json([]);
  }
};

exports.getRecentResolved = async (req, res) => {
  try {
    const submissions = await getAllSubmissions();
    if (!submissions || submissions.length === 0) {
      return res.json([]);
    }
    
    // Only resolved submissions
    const resolvedSubs = submissions.filter(s => {
      if (!s.status) return false;
      const statusLower = s.status.toLowerCase();
      return statusLower === 'resolved';
    });
    
    if (resolvedSubs.length === 0) {
      return res.json([]);
    }
    
    // Sort by updatedAt (if available) or createdAt desc
    const sorted = resolvedSubs.sort((a, b) => {
      try {
        const aDate = a.updatedat || a.updatedAt || a.createdat || a.createdAt;
        const bDate = b.updatedat || b.updatedAt || b.createdat || b.createdAt;
        
        if (!aDate && !bDate) return 0;
        if (!aDate) return 1;
        if (!bDate) return -1;
        
        const aTime = aDate instanceof Date ? aDate.getTime() : new Date(aDate).getTime();
        const bTime = bDate instanceof Date ? bDate.getTime() : new Date(bDate).getTime();
        
        if (isNaN(aTime) || isNaN(bTime)) return 0;
        
        return bTime - aTime;
      } catch (e) {
        return 0;
      }
    });
    
    // Add votes to each submission
    const submissionsWithVotes = await Promise.all(
      sorted.slice(0, 5).map(async (sub) => {
        try {
          const votes = sub.id ? await countVotes(sub.id) : 0;
          return { ...sub, votes: votes.toString() };
        } catch (e) {
          console.error('Error counting votes for submission', sub.id, ':', e);
          return { ...sub, votes: '0' };
        }
      })
    );
    
    res.json(submissionsWithVotes);
  } catch (err) {
    console.error('Error in getRecentResolved:', err);
    // Return empty array instead of error to prevent frontend crashes
    res.status(200).json([]);
  }
}; 