/**
 * Order Type Definitions
 */

// Order Status Enum
export type OrderStatus = 
  | "PENDING" 
  | "CONFIRMED" 
  | "PROCESSING" 
  | "SHIPPED" 
  | "DELIVERED" 
  | "CANCELLED" 
  | "RETURNED";

// Payment Method Enum
export type PaymentMethod = 
  | "CASH_ON_DELIVERY" 
  | "CREDIT_CARD" 
  | "DEBIT_CARD" 
  | "KHQR" 
  | "BANK_TRANSFER" 
  | "PAYPAL";

// Payment Status Enum
export type PaymentStatus = 
  | "PENDING" 
  | "PAID" 
  | "FAILED" 
  | "REFUNDED";

// Order Item
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productSlug: string;
  productImage?: string;
  sizeId: number;
  sizeName: string;
  quantity: number;
  price: number;
  total: number;
}

// Order
export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  addressId: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  totalItems: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  notes?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Create Order Request
export interface CreateOrderRequest {
  addressId: number;
  paymentMethod: PaymentMethod;
  items: {
    productId: number;
    productSizeId: number;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  notes?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}