import React from 'react';
import type { Product } from '../types';

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart }) => {
  if (products.length === 0) {
    return (
      <div className="loading">
        <p>No products found.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <div key={product._id} className="product-card">
          <div className="product-image">
            <div className="product-placeholder">
              📦
            </div>
          </div>
          <div className="product-content">
            <h3 className="product-title">{product.name}</h3>
            <div className="product-details">
              <div className="product-price">${product.price.toFixed(2)}</div>
              <div className="product-stock">
                {product.quantity > 0 ? (
                  <span className="in-stock">✅ In Stock: {product.quantity}</span>
                ) : (
                  <span className="out-of-stock">❌ Out of Stock</span>
                )}
              </div>
            </div>
            <button 
              onClick={() => onAddToCart(product)}
              disabled={product.quantity === 0}
              className="add-to-cart-btn"
            >
              {product.quantity > 0 ? '🛒 Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList; 