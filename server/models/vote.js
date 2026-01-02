const client = require('../db/scylla');

async function addVote(submissionId, userId) {
  const query = 'INSERT INTO votes (submissionId, userId) VALUES (?, ?)';
  await client.execute(query, [submissionId, userId], { prepare: true });
}

async function countVotes(submissionId) {
  try {
    if (!submissionId) return 0;
    const query = 'SELECT COUNT(*) FROM votes WHERE submissionId = ?';
    const result = await client.execute(query, [submissionId], { prepare: true });
    if (result.rows && result.rows[0]) {
      // Handle different possible column names
      return result.rows[0]['count'] || result.rows[0].count || 0;
    }
    return 0;
  } catch (err) {
    console.error('Error counting votes for submission', submissionId, ':', err);
    return 0; // Return 0 instead of throwing to prevent cascading failures
  }
}

module.exports = { addVote, countVotes }; 