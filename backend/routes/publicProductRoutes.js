const express = require('express');
const { getProducts } = require('../controllers/productController');

const router = express.Router();

// Public routes
router.get('/', getProducts);

module.exports = router;
