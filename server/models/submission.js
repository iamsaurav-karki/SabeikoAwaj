const client = require('../db/scylla');
const { v4: uuidv4 } = require('uuid');

async function createSubmission({ title, content, userId, status = 'pending', department, type }) {
  const id = uuidv4();
  const createdAt = new Date();
  const query = 'INSERT INTO submissions (id, title, content, userId, status, department, createdAt, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  await client.execute(query, [id, title, content, userId, status, department, createdAt, type], { prepare: true });
  return { id, title, content, userId, status, department, createdAt, type };
}

async function getAllSubmissions() {
  try {
    // This query is rebuilt to be robust. It explicitly selects all columns and casts
    // the nullable 'userid' column (which is lowercase in the DB) to TEXT.
    // This prevents the driver from failing on anonymous (null) user submissions.
    const query = 'SELECT id, title, content, createdat, department, status, type, CAST(userid AS TEXT) as userid FROM submissions';
    const result = await client.execute(query);
    return result.rows;
  } catch (err) {
    // Add a detailed error log for any unexpected database issues.
    console.error('DATABASE ERROR in getAllSubmissions:', err);
    throw err;
  }
}

async function getSubmissionById(id) {
  const query = 'SELECT * FROM submissions WHERE id = ?';
  const result = await client.execute(query, [id], { prepare: true });
  return result.rows[0];
}

async function updateSubmissionStatus(id, status) {
  const query = 'UPDATE submissions SET status = ? WHERE id = ?';
  await client.execute(query, [status, id], { prepare: true });
}

async function updateSubmission(id, { title, content, department }) {
  const query = 'UPDATE submissions SET title = ?, content = ?, department = ? WHERE id = ?';
  await client.execute(query, [title, content, department, id], { prepare: true });
}

async function updateSubmissionDepartment(id, department) {
  const query = 'UPDATE submissions SET department = ? WHERE id = ?';
  await client.execute(query, [department, id], { prepare: true });
}

async function deleteSubmission(id) {
  // First, delete associated votes to maintain data integrity
  const deleteVotesQuery = 'DELETE FROM votes WHERE submissionId = ?';
  await client.execute(deleteVotesQuery, [id], { prepare: true });
  
  // Then, delete the submission itself
  const deleteSubmissionQuery = 'DELETE FROM submissions WHERE id = ?';
  await client.execute(deleteSubmissionQuery, [id], { prepare: true });
}

module.exports = { createSubmission, getAllSubmissions, getSubmissionById, updateSubmissionStatus, updateSubmission, deleteSubmission, updateSubmissionDepartment }; 