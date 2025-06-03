// Seed script to create demo admin and user accounts
require('dotenv').config();
const mongoose = require('./connection');
const User = require('./models/User');

const createSeedUsers = async () => {
  try {
    // Connection is already established in the connection module
    console.log('Using existing MongoDB connection');

    // Delete all users
    await User.deleteMany({});
    console.log('All users deleted');

    // Create admin user
    // const adminUser = await User.create({
    //   name: 'Admin User',
    //   email: 'admin@demo.com',
    //   password: 'admin123',
    //   role: 'admin',
    // });
    console.log('Admin user created:', adminUser.email);

    // Create regular user
    const regularUser = await User.create({
      name: 'Regular User',
      email: 'user@demo.com',
      password: 'user123',
      role: 'user',
    });
    console.log('Regular user created:', regularUser.email);

    console.log('Seed data created successfully');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

createSeedUsers();
