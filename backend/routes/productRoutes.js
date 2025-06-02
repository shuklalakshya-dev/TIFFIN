const express = require('express');
const { protect, admin } = require('../middleware/auth');
const { 
  getAdminProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const router = express.Router();

router.route('/')
  .get(protect, admin, getAdminProducts)
  .post(protect, admin, createProduct);

router.route('/:id')
  .get(protect, admin, getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;
