const { registerUser } = require('../models/user');
require('dotenv').config();

async function createAdmin() {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (query) => new Promise(resolve => readline.question(query, resolve));

  try {
    console.log('\n=== Create Admin User ===\n');
    
    const name = await question('Enter admin name: ');
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password: ');
    
    if (!name || !email || !password) {
      console.error('❌ All fields are required!');
      process.exit(1);
    }

    console.log('\n⏳ Creating admin user...');
    const user = await registerUser({ name, email, password, role: 'admin' });
    
    console.log('\n✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n💡 You can now login using the Admin button on the website.\n');
    
  } catch (err) {
    if (err.message.includes('already exists') || err.message.includes('Email already')) {
      console.error('\n❌ Error: A user with this email already exists!');
    } else {
      console.error('\n❌ Error creating admin:', err.message);
    }
    process.exit(1);
  } finally {
    readline.close();
  }
}

createAdmin();

