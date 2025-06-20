export interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
}

export interface Order {
  _id: string;
  customerId: string;
  productIds: string[];
  totalAmount: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
}

export interface OrderHistory {
    _id: string;
    customerId: string;
    productId: string;
    quantity: number;
    status: string;
    orderId?: string;
    createdAt: string;
}

export interface CartItem extends Product {
  cartQuantity: number;
} 