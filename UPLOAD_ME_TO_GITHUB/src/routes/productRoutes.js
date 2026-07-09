const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET - All products
router.get('/', productController.getAllProducts);

// GET - Search products
router.get('/search', productController.searchProducts);

// GET - Product by ID
router.get('/:id', productController.getProductById);

// POST - Create product
router.post('/', productController.createProduct);

module.exports = router;
