import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { customerClient, inventoryClient } from '../lib/graphql';
import { gql } from 'graphql-request';
import type { Order } from '../types';

const CREATE_ORDER = gql`
  mutation CreateOrder($createOrderInput: CreateOrderInput!) {
    createOrder(createOrderInput: $createOrderInput) {
      _id
      customerId
      productId
      quantity
      status
    }
  }
`;

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const [customerId, setCustomerId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderResponse, setOrderResponse] = useState<any[] | null>(null);

  const handlePlaceOrder = async () => {
    if (!customerId) {
      setError('Please enter a Customer ID.');
      return;
    }
    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setOrderResponse(null);

    try {
      const orderPromises = cartItems.map((item) => {
        const createOrderInput = {
          customerId: customerId,
          productId: item._id,
          quantity: item.cartQuantity,
        };
        return inventoryClient.request(CREATE_ORDER, { createOrderInput });
      });

      const responses = await Promise.all(orderPromises);
      setOrderResponse(responses.map((res: any) => res.createOrder));
      clearCart();
    } catch (err: any) {
      setError(err.response?.errors[0]?.message || 'Failed to place one or more orders.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0 && !orderResponse) {
    return (
      <div>
        <h1>🛒 Shopping Cart</h1>
        <div className="loading">
          <p>Your cart is empty. Add some products from the home page!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>🛒 Shopping Cart</h1>
      {orderResponse ? (
        <div className="success-message">
          <h2>🎉 Order(s) Placed Successfully!</h2>
          <p>Your order has been processed. Here are the details:</p>
          <div style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
            <pre style={{ color: 'white', margin: 0, fontSize: '0.875rem' }}>
              {JSON.stringify(orderResponse, null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <div className="cart-item-info">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-price">${item.price.toFixed(2)} each</div>
              </div>
              <div className="cart-item-quantity">
                <label>Qty:</label>
                <input
                  type="number"
                  value={item.cartQuantity}
                  onChange={(e) => updateQuantity(item._id, parseInt(e.target.value, 10))}
                  min="1"
                  className="quantity-input"
                />
              </div>
              <div className="cart-item-total">
                ${(item.price * item.cartQuantity).toFixed(2)}
              </div>
              <button onClick={() => removeFromCart(item._id)} className="remove-btn">
                🗑️ Remove
              </button>
            </div>
          ))}
          
          <div className="cart-summary">
            <div className="cart-total">
              Total: ${cartTotal.toFixed(2)}
            </div>
          </div>

          <div className="order-form">
            <h3>📝 Complete Your Order</h3>
            <p>Enter your Customer ID to place the order:</p>
            <div className="customer-id-input">
              <input
                type="text"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                placeholder="Enter existing Customer ID"
              />
              <button onClick={handlePlaceOrder} disabled={isLoading}>
                {isLoading ? '⏳ Placing Order...' : '🚀 Place Order'}
              </button>
            </div>
            {error && <div className="error">{error}</div>}
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage; 