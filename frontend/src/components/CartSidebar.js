import React from 'react';
import { FaTimes, FaShoppingCart, FaPlus, FaMinus, FaTrash } from 'react-icons/fa';

const CartSidebar = ({
  isOpen,
  onClose,
  cartItems,
  cartTotal,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <button className="close-cart-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">
                <FaShoppingCart />
              </div>
              <h3>Your cart is empty</h3>
              <p>Add some products to get started!</p>
            </div>
          ) : (
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.productId} className="cart-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80x80?text=Product';
                    }}
                  />
                  <div className="cart-item-details">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">${item.price.toFixed(2)}</div>
                    <div className="cart-item-actions">
                      <button
                        className="quantity-btn"
                        onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus />
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                      >
                        <FaPlus />
                      </button>
                      <button
                        className="remove-btn"
                        onClick={() => onRemoveItem(item.productId)}
                      >
                        <FaTrash /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span className="total-label">Total:</span>
              <span className="total-amount">${cartTotal.toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={onCheckout}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
