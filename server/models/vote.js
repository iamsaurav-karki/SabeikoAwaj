const client = require('../db/scylla');

async function addVote(submissionId, userId) {
  const query = 'INSERT INTO votes (submissionId, userId) VALUES (?, ?)';
  await client.execute(query, [submissionId, userId], { prepare: true });
}

async function countVotes(submissionId) {
  const query = 'SELECT COUNT(*) FROM votes WHERE submissionId = ?';
  const result = await client.execute(query, [submissionId], { prepare: true });
  return result.rows[0]['count'];
}

module.exports = { addVote, countVotes }; 