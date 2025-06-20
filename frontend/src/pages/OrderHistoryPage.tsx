import React, { useState, useEffect } from 'react';
import { gql } from '@apollo/client';
import { customerClient, inventoryClient } from '../lib/graphql';
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
      orderId
      createdAt
    }
  }
`;

const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($orderId: ID!, $status: String!) {
    updateOrderStatus(orderId: $orderId, status: $status) {
      _id
      status
    }
  }
`;

const ORDER_STATUS_UPDATED_SUBSCRIPTION = gql`
  subscription OrderStatusUpdated($customerId: ID!) {
    orderStatusUpdated(customerId: $customerId) {
      _id
      status
      customerId
    }
  }
`;

const OrderHistoryPage: React.FC = () => {
  const [customerId, setCustomerId] = useState('');
  const [history, setHistory] = useState<OrderHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Effect for the subscription
  useEffect(() => {
    if (!customerId) return;

    const observer = inventoryClient.subscribe({
      query: ORDER_STATUS_UPDATED_SUBSCRIPTION,
      variables: { customerId },
    });

    const subscription = observer.subscribe(({ data }) => {
      const updatedOrder = data.orderStatusUpdated;
      console.log('Subscription received:', updatedOrder);
      
      setHistory((prevHistory) =>
        prevHistory.map((order) =>
          order.orderId === updatedOrder._id
            ? { ...order, status: updatedOrder.status }
            : order
        )
      );
      
      // Clear the updating state
      setUpdatingOrderId(null);
    });

    return () => subscription.unsubscribe();
  }, [customerId]);

  const handleFetchHistory = async () => {
    if (!customerId) {
      setError('Please enter a Customer ID.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setHistory([]);

    try {
      // Note: We are now using the simple customerClient again for this query
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

  const handleCompleteOrder = async (orderId: string) => {
    try {
      setUpdatingOrderId(orderId);
      await inventoryClient.mutate({
        mutation: UPDATE_ORDER_STATUS,
        variables: { orderId, status: 'COMPLETED' },
      });
      // The UI will update via the subscription, so no manual state change is needed here.
    } catch (err) {
      console.error('Failed to update order status', err);
      alert('Failed to mark order as completed. See console for details.');
      setUpdatingOrderId(null);
    }
  };


  return (
    <div>
      <h1>📋 Order History</h1>
      <CreateCustomerForm />

      <div className="order-form">
        <h3>🔍 View Order History & Real-Time Updates</h3>
        <p>Enter a Customer ID to view their history and subscribe to real-time status updates.</p>
        <div className="customer-id-input">
          <input
            type="text"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            placeholder="Enter Customer ID"
          />
          <button onClick={handleFetchHistory} disabled={isLoading}>
            {isLoading ? '⏳ Fetching...' : '🔍 Get History'}
          </button>
        </div>
        {error && <div className="error">{error}</div>}
      </div>

      {history.length > 0 && (
        <div>
          <h3>📊 History for Customer: {customerId}</h3>
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
                    marginLeft: '0.5rem',
                    transition: 'all 0.3s ease',
                    ...(updatingOrderId === record.orderId && {
                      animation: 'pulse 1s infinite',
                      backgroundColor: '#fef3c7',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem'
                    })
                  }}>
                    {updatingOrderId === record.orderId ? '🔄 UPDATING...' : record.status}
                  </span>
                </p>
                <p><strong>Date:</strong> {new Date(record.createdAt).toLocaleString()}</p>
                {record.status === 'PENDING' && (
                  record.orderId ? (
                    <button 
                      onClick={() => handleCompleteOrder(record.orderId!)}
                      disabled={updatingOrderId === record.orderId}
                      style={{ 
                        marginTop: '1rem',
                        opacity: updatingOrderId === record.orderId ? 0.6 : 1,
                        cursor: updatingOrderId === record.orderId ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {updatingOrderId === record.orderId ? '⏳ Updating...' : 'Mark as Completed'}
                    </button>
                  ) : (
                    <p style={{ marginTop: '1rem', color: '#dc2626', fontSize: '0.875rem' }}>
                      ⚠️ Cannot update: This is an old order record
                    </p>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage; 