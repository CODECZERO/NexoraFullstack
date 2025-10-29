const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const mockProducts = require('../config/seedData');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB Connected for seeding...');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert mock products
    await Product.insertMany(mockProducts);
    console.log(`${mockProducts.length} products seeded successfully`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
