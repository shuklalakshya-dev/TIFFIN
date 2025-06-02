// Test MongoDB connection
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

console.log('Environment variables:');
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET);

// Read the .env file directly
const envPath = path.resolve('.env');
console.log('Env file path:', envPath);
try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('.env file content:');
  console.log(envContent);
} catch (err) {
  console.error('Error reading .env file:', err);
}

const testConnection = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';
    console.log('Connecting to MongoDB with:', uri);
    await mongoose.connect(uri);
    console.log('MongoDB connection successful!');
    process.exit(0);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

testConnection();
