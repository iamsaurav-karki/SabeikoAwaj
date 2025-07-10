const client = require('../db/scylla');

async function addContact({ name, type, number }) {
  const query = 'INSERT INTO contacts (name, type, number) VALUES (?, ?, ?)';
  await client.execute(query, [name, type, number], { prepare: true });
}

async function getContactsByType(type) {
  const query = 'SELECT * FROM contacts WHERE type = ? ALLOW FILTERING';
  const result = await client.execute(query, [type], { prepare: true });
  return result.rows;
}

module.exports = { addContact, getContactsByType }; 