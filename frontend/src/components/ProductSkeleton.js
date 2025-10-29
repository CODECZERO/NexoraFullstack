import React from 'react';
import './ProductSkeleton.css';

const ProductSkeleton = ({ count = 6 }) => {
  return Array(count).fill(0).map((_, index) => (
    <div key={index} className="skeleton-product">
      <div className="skeleton-image" />
      <div className="skeleton-details">
        <div className="skeleton-line short" />
        <div className="skeleton-line medium" />
        <div className="skeleton-line long" />
        <div className="skeleton-footer">
          <div className="skeleton-line price" />
          <div className="skeleton-button" />
        </div>
      </div>
    </div>
  ));
};

export default ProductSkeleton;
