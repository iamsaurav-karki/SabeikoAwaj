const cassandra = require('cassandra-driver');
require('dotenv').config();

const client = new cassandra.Client({
  contactPoints: [process.env.DB_HOST || '127.0.0.1'],
  localDataCenter: process.env.DB_DATACENTER || 'datacenter1',
  keyspace: process.env.DB_KEYSPACE || 'sabeiko_awaj'
});

module.exports = client; 