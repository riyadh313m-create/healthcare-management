const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare_management');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Hospital.deleteMany({});
    await Doctor.deleteMany({});
    console.log('Cleared existing data');

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    console.log('Password hashed successfully');

    // Create admin users
    const users = await User.insertMany([
      {
        username: 'admin',
        password: hashedPassword,
        role: 'chief_of_doctors',
        fullName: 'رئيس الأطباء العموم',
        phone: '07700000000',
        jobTitle: 'رئيس الأطباء العموم'
      },
      {
        username: 'admina',
        password: hashedPassword,
        role: 'chief_of_doctors',
        fullName: 'رئيس الأطباء العموم المساعد',
        phone: '07700000001',
        jobTitle: 'رئيس الأطباء العموم المساعد'
      }
    ]);

    console.log('Created users:', users.length);
    console.log('Database seeded successfully - Empty state ready for API use');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seed function
seedDatabase();