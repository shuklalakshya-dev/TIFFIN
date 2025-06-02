require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

// Add debugging to see what's happening
console.log('MongoDB URI:', MONGODB_URI ? 'Found URI (hidden for security)' : 'URI is undefined!');

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Database connection error:', err));

module.exports = mongoose.connection;
