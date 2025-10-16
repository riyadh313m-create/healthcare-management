const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

async function testLogin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare_management');
    console.log('Connected to MongoDB');

    // Find all users
    const users = await User.find({});
    console.log('\n=== Users in database ===');
    console.log('Total users:', users.length);
    
    for (const user of users) {
      console.log(`\nUsername: ${user.username}`);
      console.log(`Password Hash: ${user.password}`);
      console.log(`Role: ${user.role}`);
      console.log(`Active: ${user.isActive}`);
      
      // Test password
      const testPassword = 'admin123';
      const isValid = await bcrypt.compare(testPassword, user.password);
      console.log(`Password 'admin123' is valid: ${isValid}`);
      
      // Generate new hash for comparison
      const newHash = await bcrypt.hash(testPassword, 10);
      console.log(`New hash example: ${newHash}`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

testLogin();
