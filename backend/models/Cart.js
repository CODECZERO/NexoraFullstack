const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  image: {
    type: String
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 'mock-user-001',
    required: true
  },
  items: [cartItemSchema],
  total: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

cartSchema.methods.calculateTotal = function() {
  this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return this.total;
};

module.exports = mongoose.model('Cart', cartSchema);
