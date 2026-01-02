// const cassandra = require('cassandra-driver');
//
// async function initTables() {
//   // Step 1: Connect without keyspace to create keyspace if not exists
//   const sysClient = new cassandra.Client({
//     contactPoints: [process.env.DB_HOST || '127.0.0.1'],
//     localDataCenter: process.env.DB_DATACENTER || 'datacenter1',
//   });
//   try {
//     await sysClient.execute(`CREATE KEYSPACE IF NOT EXISTS sabeiko_awaj WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1}`);
//     console.log('Keyspace created or already exists.');
//   } catch (err) {
//     console.error('Error creating keyspace:', err);
//     await sysClient.shutdown();
//     return;
//   }
//   await sysClient.shutdown();
//
//   // Step 2: Connect with keyspace to create tables
//   const client = new cassandra.Client({
//     contactPoints: [process.env.DB_HOST || '127.0.0.1'],
//     localDataCenter: process.env.DB_DATACENTER || 'datacenter1',
//     keyspace: process.env.DB_KEYSPACE || 'sabeiko_awaj',
//   });
//   try {
//     await client.execute(`CREATE TABLE IF NOT EXISTS users (
//       id UUID PRIMARY KEY,
//       name TEXT,
//       email TEXT,
//       password TEXT,
//       role TEXT
//     )`);
//     await client.execute(`CREATE TABLE IF NOT EXISTS submissions (
//       id UUID PRIMARY KEY,
//       title TEXT,
//       content TEXT,
//       userId UUID,
//       status TEXT,
//       department TEXT,
//       createdAt TIMESTAMP
//     )`);
//     await client.execute(`CREATE TABLE IF NOT EXISTS votes (
//       submissionId UUID,
//       userId UUID,
//       PRIMARY KEY (submissionId, userId)
//     )`);
//     await client.execute(`CREATE TABLE IF NOT EXISTS contacts (
//       id UUID PRIMARY KEY,
//       name TEXT,
//       email TEXT,
//       message TEXT,
//       createdAt TIMESTAMP
//     )`);
//     console.log('Tables created or already exist.');
//   } catch (err) {
//     console.error('Error creating tables:', err);
//   } finally {
//     await client.shutdown();
//   }
// }
//
// initTables(); 


const cassandra = require('cassandra-driver');

async function initTables() {
  // Step 1: Connect without keyspace to create keyspace if not exists
  const sysClient = new cassandra.Client({
    contactPoints: [process.env.DB_HOST || '127.0.0.1'],
    localDataCenter: process.env.DB_DATACENTER || 'datacenter1',
  });

  try {
    await sysClient.execute(`
      CREATE KEYSPACE IF NOT EXISTS sabeiko_awaj
      WITH replication = {
        'class': 'SimpleStrategy',
        'replication_factor': 1
      }
    `);
    console.log('Keyspace created or already exists.');
  } catch (err) {
    console.error('Error creating keyspace:', err);
    await sysClient.shutdown();
    return;
  }

  await sysClient.shutdown();

  // Step 2: Connect with keyspace to create tables
  const client = new cassandra.Client({
    contactPoints: [process.env.DB_HOST || '127.0.0.1'],
    localDataCenter: process.env.DB_DATACENTER || 'datacenter1',
    keyspace: process.env.DB_KEYSPACE || 'sabeiko_awaj',
  });

  try {
    // Users table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        name TEXT,
        email TEXT,
        password TEXT,
        role TEXT,
        createdat TIMESTAMP
      )
    `);

    // Users by email for efficient queries
    await client.execute(`
      CREATE TABLE IF NOT EXISTS users_by_email (
        email TEXT PRIMARY KEY,
        id UUID,
        name TEXT,
        password TEXT,
        role TEXT
      )
    `);

    // Submissions table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS submissions (
        id UUID PRIMARY KEY,
        title TEXT,
        content TEXT,
        user_id UUID,
        submission_type TEXT,
        status TEXT,
        department TEXT,
        created_at TIMESTAMP
      )
    `);

    // Votes table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS votes (
        submission_id UUID,
        user_id UUID,
        voted_at TIMESTAMP,
        PRIMARY KEY (submission_id, user_id)
      )
    `);

    // Contacts table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS contacts (
        id UUID PRIMARY KEY,
        name TEXT,
        contact_type TEXT,
        contact_value TEXT,
        created_at TIMESTAMP
      )
    `);

    console.log('Tables created or already exist.');
  } catch (err) {
    console.error('Error creating tables:', err);
  } finally {
    await client.shutdown();
  }
}

// Run table initialization
initTables();

