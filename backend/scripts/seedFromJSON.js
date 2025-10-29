const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');

dotenv.config();

const seedFromJSON = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB Connected for seeding...');
    
    // Read JSON file
    const jsonFilePath = path.join(__dirname, '../config/testProducts.json');
    const jsonData = fs.readFileSync(jsonFilePath, 'utf-8');
    const products = JSON.parse(jsonData);
    
    console.log(`Found ${products.length} products in JSON file`);
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert products from JSON
    await Product.insertMany(products);
    console.log(`${products.length} products seeded successfully from JSON file`);
    
    // Display seeded products
    console.log('\nSeeded Products:');
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database from JSON:', error);
    process.exit(1);
  }
};

seedFromJSON();
