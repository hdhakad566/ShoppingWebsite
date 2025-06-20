# Microservices E-Commerce Platform

This project is a simple e-commerce application built with a microservices architecture. It includes two backend services, a frontend client, and uses RabbitMQ for asynchronous communication between services.

## Technology Stack

- **Frontend:** React (Vite), TypeScript, GraphQL Client
- **Backend Services:** NestJS, GraphQL, MongoDB (Mongoose)
- **Message Broker:** RabbitMQ
- **Database:** MongoDB

## Architecture Overview

The application is split into three main parts:

1.  **`inventory-order-service` (Port 3000):**
    -   Manages products (create, read).
    -   Manages orders (create, read).
    -   When an order is created, it publishes an `order_created` event to RabbitMQ.

2.  **`customer-service` (Port 3001):**
    -   Manages customers (create, read).
    -   Listens for `order_created` events from RabbitMQ.
    -   When an event is received, it creates an entry in the customer's order history.

3.  **`frontend` (Port 5173):**
    -   A React application that allows users to view products, create customers, place orders, and view their order history.

![Architecture Diagram](https://i.imgur.com/example.png)  <-- We can create a diagram for this if you like.

## How to Run the Application

### Prerequisites
- Node.js
- MongoDB running on `mongodb://localhost:27017`
- RabbitMQ running on the default port

### 1. Start the Backend Services

Open two separate terminals.

**In the first terminal:**
```bash
cd inventory-order-service
npm install
npm run start:dev
```
The service will be available at `http://localhost:3000/graphql`.

**In the second terminal:**
```bash
cd customer-service
npm install
npm run start:dev
```
The service will be available at `http://localhost:3001/graphql`.

### 2. Start the Frontend

Open a third terminal.

```bash
cd frontend
npm install
npm run dev
```
The application will be running at `http://localhost:5173`.

## End-to-End Workflow

1.  **Create a Customer:** Navigate to the "Order History" page and create a new customer. Copy the generated customer ID.
2.  **Add Products to Cart:** Go to the "Home" page and add items to your cart.
3.  **Place Order:** Go to the "Cart" page, paste the customer ID, and place the order.
4.  **Verify History:** Return to the "Order History" page, enter the customer ID, and you will see the new order appear. This demonstrates the full, event-driven workflow. 