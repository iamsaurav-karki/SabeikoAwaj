const client = require('../db/scylla');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

async function registerUser({ name, email, password, role = 'citizen' }) {
  const id = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = 'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)';
  await client.execute(query, [id, name, email, hashedPassword, role], { prepare: true });
  return { id, name, email, role };
}

async function findUserByEmail(email) {
  const query = 'SELECT * FROM users WHERE email = ? ALLOW FILTERING';
  const result = await client.execute(query, [email], { prepare: true });
  return result.rows[0];
}

async function authenticateUser(email, password) {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;
  return user;
}

module.exports = { registerUser, findUserByEmail, authenticateUser }; 