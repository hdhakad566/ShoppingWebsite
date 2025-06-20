import React, { useEffect, useState } from 'react';
import { gql } from 'graphql-request';
import { inventoryClient } from '../lib/graphql';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';
import ProductList from '../components/ProductList';

const GET_PRODUCTS_QUERY = gql`
  query {
    products {
      _id
      name
      price
      quantity
    }
  }
`;

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await inventoryClient.request<{ products: Product[] }>(GET_PRODUCTS_QUERY);
        setProducts(data.products);
      } catch (err) {
        setError('Failed to fetch products. Is the inventory service running?');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    // We'll add a toast notification here later
  };

  if (loading) return (
    <div className="loading">
      <h2>🔄 Loading Products...</h2>
      <p>Please wait while we fetch the latest products.</p>
    </div>
  );
  
  if (error) return (
    <div className="error">
      <h2>❌ Error Loading Products</h2>
      <p>{error}</p>
      <p>Please make sure the inventory service is running on port 3000.</p>
    </div>
  );

  return (
    <div>
      <h1>🛍️ Our Products</h1>
      <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2rem' }}>
        Browse our selection and add items to your cart
      </p>
      <ProductList products={products} onAddToCart={handleAddToCart} />
    </div>
  );
};

export default HomePage; 