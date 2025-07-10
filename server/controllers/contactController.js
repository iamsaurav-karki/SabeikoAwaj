const client = require('../db/scylla');
const { v4: uuidv4 } = require('uuid');

exports.submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields required' });
    }
    const id = uuidv4();
    const createdAt = new Date();
    await client.execute('INSERT INTO contacts (id, name, email, message, createdAt) VALUES (?, ?, ?, ?, ?)', [id, name, email, message, createdAt], { prepare: true });
    res.json({ message: 'Message received' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 