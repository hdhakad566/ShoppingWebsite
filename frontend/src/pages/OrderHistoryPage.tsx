import React, { useState } from 'react';
import { gql } from 'graphql-request';
import { customerClient } from '../lib/graphql';
import type { OrderHistory } from '../types';
import CreateCustomerForm from '../components/CreateCustomerForm';

const GET_ORDER_HISTORY = gql`
  query {
    orderHistories {
      _id
      customerId
      productId
      quantity
      status
      createdAt
    }
  }
`;

const OrderHistoryPage: React.FC = () => {
  const [customerId, setCustomerId] = useState('');
  const [history, setHistory] = useState<OrderHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchHistory = async () => {
    if (!customerId) {
      setError('Please enter a Customer ID.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setHistory([]);

    try {
      const response = await customerClient.request<{ orderHistories: OrderHistory[] }>(
        GET_ORDER_HISTORY
      );
      const filteredHistory = response.orderHistories.filter(
        (record) => record.customerId === customerId
      );
      setHistory(filteredHistory);
      if (filteredHistory.length === 0) {
        setError('No history found for this customer.');
      }
    } catch (err: any) {
      setError(err.response?.errors[0]?.message || 'Failed to fetch order history.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>📋 Order History</h1>
      <CreateCustomerForm />

      <div className="order-form">
        <h3>🔍 View Order History</h3>
        <p>Enter a Customer ID to view their order history:</p>
        <div className="customer-id-input">
          <input
            type="text"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            placeholder="Enter Customer ID to view history"
          />
          <button onClick={handleFetchHistory} disabled={isLoading}>
            {isLoading ? '⏳ Fetching...' : '🔍 Get History'}
          </button>
        </div>
        {error && <div className="error">{error}</div>}
      </div>

      {history.length > 0 && (
        <div>
          <h3>📊 History for Customer</h3>
          <div>
            {history.map((record) => (
              <div key={record._id} className="history-item">
                <p><strong>Product ID:</strong> {record.productId}</p>
                <p><strong>Quantity:</strong> {record.quantity}</p>
                <p><strong>Status:</strong> 
                  <span style={{ 
                    color: record.status === 'COMPLETED' ? '#059669' : 
                           record.status === 'PENDING' ? '#d97706' : '#dc2626',
                    fontWeight: '600',
                    marginLeft: '0.5rem'
                  }}>
                    {record.status}
                  </span>
                </p>
                <p><strong>Date:</strong> {new Date(record.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage; 