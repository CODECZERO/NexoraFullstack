import React, { useState } from 'react';
import { FaTimes, FaCheckCircle } from 'react-icons/fa';
import './CheckoutModal.css';

const CheckoutModal = ({ isOpen, onClose, cartItems, cartTotal, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData.name, formData.email);
      setFormData({ name: '', email: '' });
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="modal-header">
          <h2>Checkout</h2>
          <p>Complete your order</p>
        </div>

        <div className="modal-body">
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {cartItems.map((item) => (
                <div key={item.productId} className="summary-item">
                  <span className="item-name">
                    {item.name} x {item.quantity}
                  </span>
                  <span className="item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="summary-total">
              <span>Total:</span>
              <span className="total-price">${cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <button
              type="submit"
              className="submit-order-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const ReceiptModal = ({ isOpen, onClose, receipt }) => {
  if (!isOpen || !receipt) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content receipt-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="receipt-header">
          <div className="success-icon">
            <FaCheckCircle />
          </div>
          <h2>Order Successful!</h2>
          <p>Thank you for your purchase</p>
        </div>

        <div className="receipt-body">
          <div className="receipt-info">
            <div className="info-row">
              <span className="info-label">Order ID:</span>
              <span className="info-value">{receipt.orderId}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Customer:</span>
              <span className="info-value">{receipt.customerName}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{receipt.customerEmail}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Date:</span>
              <span className="info-value">
                {new Date(receipt.timestamp).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="receipt-items">
            <h3>Order Items</h3>
            {receipt.items.map((item, index) => (
              <div key={index} className="receipt-item">
                <span className="item-name">
                  {item.name} x {item.quantity}
                </span>
                <span className="item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="receipt-total">
            <span>Total Amount:</span>
            <span className="total-amount">${receipt.total.toFixed(2)}</span>
          </div>

          <div className="receipt-message">
            <p>{receipt.message}</p>
          </div>
        </div>

        <button className="continue-shopping-btn" onClick={onClose}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default CheckoutModal;
