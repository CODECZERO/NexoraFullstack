const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// GET /api/test-products - Get products from JSON file
router.get('/', (req, res) => {
  try {
    // Read JSON file
    const jsonFilePath = path.join(__dirname, '../config/testProducts.json');
    const jsonData = fs.readFileSync(jsonFilePath, 'utf-8');
    const products = JSON.parse(jsonData);
    
    res.json({
      success: true,
      source: 'JSON file',
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error reading JSON file',
      error: error.message
    });
  }
});

// GET /api/test-products/:id - Get single product from JSON file
router.get('/:id', (req, res) => {
  try {
    const jsonFilePath = path.join(__dirname, '../config/testProducts.json');
    const jsonData = fs.readFileSync(jsonFilePath, 'utf-8');
    const products = JSON.parse(jsonData);
    
    const product = products.find(p => p.id === parseInt(req.params.id));
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in JSON file'
      });
    }
    
    res.json({
      success: true,
      source: 'JSON file',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error reading JSON file',
      error: error.message
    });
  }
});

module.exports = router;
