import React, { useState } from 'react';
import { gql } from 'graphql-request';
import { customerClient } from '../lib/graphql';
import type { Customer } from '../types';

const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($createCustomerInput: CreateCustomerInput!) {
    createCustomer(createCustomerInput: $createCustomerInput) {
      _id
      name
      email
    }
  }
`;

const CreateCustomerForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newCustomer, setNewCustomer] = useState<Customer | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setNewCustomer(null);

    const createCustomerInput = { name, email };

    try {
      const response = await customerClient.request<{ createCustomer: Customer }>(CREATE_CUSTOMER, {
        createCustomerInput,
      });
      setNewCustomer(response.createCustomer);
      setName('');
      setEmail('');
    } catch (err: any) {
      setError(err.response?.errors[0]?.message || 'Failed to create customer.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="customer-form">
      <h3>👤 Create New Customer</h3>
      <form onSubmit={handleSubmit} className="form-grid">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? '⏳ Creating...' : '✨ Create Customer'}
        </button>
      </form>
      {error && <div className="error">{error}</div>}
      {newCustomer && (
        <div className="success-message">
          <h4>🎉 Customer Created Successfully!</h4>
          <p><strong>ID:</strong> {newCustomer._id}</p>
          <p><strong>Name:</strong> {newCustomer.name}</p>
          <p><strong>Email:</strong> {newCustomer.email}</p>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
            💡 Copy the Customer ID above to use when placing orders!
          </p>
        </div>
      )}
    </div>
  );
};

export default CreateCustomerForm; 