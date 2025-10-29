import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';

const ProductCard = ({ product, onAddToCart, isAdding }) => {
  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.name}
        className="product-image"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/500x500?text=Product+Image';
        }}
      />
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <div className="product-price">${product.price.toFixed(2)}</div>
          <button
            className="add-to-cart-btn"
            onClick={() => onAddToCart(product)}
            disabled={isAdding}
          >
            <FaShoppingCart />
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
