const cassandra = require('cassandra-driver');
require('dotenv').config();

const client = new cassandra.Client({
  contactPoints: [process.env.DB_HOST || '127.0.0.1'],
  localDataCenter: process.env.DB_DATACENTER || 'datacenter1',
  keyspace: process.env.DB_KEYSPACE || 'sabeiko_awaj'
});

// Add error and connection event handlers
client.on('log', (level, className, message, furtherInfo) => {
  if (level === 'error') {
    console.error('Cassandra client error:', message, furtherInfo);
  }
});

// Handle connection errors
client.on('error', (err) => {
  console.error('Cassandra connection error:', err);
});

// Log successful connection
client.connect()
  .then(() => {
    console.log('Connected to ScyllaDB/Cassandra');
  })
  .catch((err) => {
    console.error('Failed to connect to ScyllaDB/Cassandra:', err.message);
    console.error('Make sure ScyllaDB is running and the keyspace exists.');
  });

module.exports = client; 