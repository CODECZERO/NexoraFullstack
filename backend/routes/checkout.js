const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Order = require('../models/Order');

// POST /api/checkout - Process checkout and return receipt
router.post('/', async (req, res) => {
  try {
    const { cartItems } = req.body;
    
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ 
        message: 'cartItems array is required' 
      });
    }

    // Calculate total from cart items
    const total = cartItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Create order receipt (mock)
    const receipt = {
      orderId: `ORD-${Date.now()}`,
      timestamp: new Date(),
      items: cartItems,
      total: total,
      status: 'completed'
    };

    // In a real app, you would save the order to the database here
    // const order = new Order({ ... });
    // await order.save();

    res.status(201).json(receipt);
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ 
      message: 'Error processing checkout',
      error: error.message 
    });
  }
});

module.exports = router;
