const Product = require('../models/Product');
const Manufacturer = require('../models/Manufacturer');

// Get All Products
exports.getAllProducts = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const products = await Product.getAll(parseInt(limit), parseInt(offset));

    res.status(200).json({
      status: 'success',
      data: products,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Get Product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Search Products
exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query must be at least 2 characters',
      });
    }

    const products = await Product.search(q);

    res.status(200).json({
      status: 'success',
      data: products,
      count: products.length,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const { name, manufacturer_id, unique_code, description } = req.body;

    if (!name || !unique_code) {
      return res.status(400).json({
        status: 'error',
        message: 'Name and unique_code are required',
      });
    }

    const productId = await Product.create({
      name,
      manufacturer_id,
      unique_code,
      description,
    });

    res.status(201).json({
      status: 'success',
      data: { id: productId },
      message: 'Product created successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};
