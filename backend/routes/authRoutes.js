const express = require('express');
const { loginUser, registerUser, getUserProfile, verifyToken } = require('../controllers/authController');
const { registerAdmin } = require('../controllers/adminAuthController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/admin-register', registerAdmin);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.get('/verify', protect, verifyToken);

module.exports = router;
