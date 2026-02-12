import api from './api';
import { 
  ApiResponse, 
  PageResponse, 
  Order, 
  CreateOrderRequest,
  OrderStatus 
} from '@/types/order.types';

class OrderService {
  private readonly BASE_URL = '/orders';

  /**
   * Create a new order
   */
  async create(data: CreateOrderRequest): Promise<Order> {
    const response = await api.post<ApiResponse<Order>>(this.BASE_URL, data);
    return response.data.data;
  }

  /**
   * Get order by ID
   */
  async getById(id: number): Promise<Order> {
    const response = await api.get<ApiResponse<Order>>(`${this.BASE_URL}/${id}`);
    return response.data.data;
  }

  /**
   * Get order by order number
   */
  async getByOrderNumber(orderNumber: string): Promise<Order> {
    const response = await api.get<ApiResponse<Order>>(`${this.BASE_URL}/number/${orderNumber}`);
    return response.data.data;
  }

  /**
   * Get current user's orders with pagination
   */
  async getMyOrders(page: number = 0, size: number = 10): Promise<PageResponse<Order>> {
    const response = await api.get<ApiResponse<PageResponse<Order>>>(
      `${this.BASE_URL}/my-orders?page=${page}&size=${size}`
    );
    return response.data.data;
  }

  /**
   * Get all orders (ADMIN only) with pagination
   */
  async getAll(page: number = 0, size: number = 10): Promise<PageResponse<Order>> {
    const response = await api.get<ApiResponse<PageResponse<Order>>>(
      `${this.BASE_URL}?page=${page}&size=${size}`
    );
    return response.data.data;
  }

  /**
   * Update order status (ADMIN only)
   */
  async updateStatus(orderId: number, status: OrderStatus): Promise<Order> {
    const response = await api.patch<ApiResponse<Order>>(
      `${this.BASE_URL}/${orderId}/status?status=${status}`
    );
    return response.data.data;
  }

  /**
   * Cancel order
   */
  async cancel(orderId: number): Promise<Order> {
    const response = await api.post<ApiResponse<Order>>(
      `${this.BASE_URL}/${orderId}/cancel`
    );
    return response.data.data;
  }

  /**
   * Delete order (ADMIN only)
   */
  async delete(orderId: number): Promise<void> {
    await api.delete<ApiResponse<string>>(`${this.BASE_URL}/${orderId}`);
  }

  /**
   * Format order status for display
   */
  getStatusLabel(status: OrderStatus): string {
    const labels: Record<OrderStatus, string> = {
      PENDING: "Pending",
      CONFIRMED: "Confirmed",
      PROCESSING: "Processing",
      SHIPPED: "Shipped",
      DELIVERED: "Delivered",
      CANCELLED: "Cancelled",
      RETURNED: "Returned",
    };
    return labels[status] || status;
  }

  /**
   * Get status color
   */
  getStatusColor(status: OrderStatus): string {
    const colors: Record<OrderStatus, string> = {
      PENDING: "yellow",
      CONFIRMED: "blue",
      PROCESSING: "purple",
      SHIPPED: "indigo",
      DELIVERED: "green",
      CANCELLED: "red",
      RETURNED: "orange",
    };
    return colors[status] || "gray";
  }

  /**
   * Format payment method for display
   */
  getPaymentMethodLabel(method: string): string {
    const labels: Record<string, string> = {
      CASH_ON_DELIVERY: "Cash on Delivery",
      CREDIT_CARD: "Credit Card",
      DEBIT_CARD: "Debit Card",
      KHQR: "KHQR",
      BANK_TRANSFER: "Bank Transfer",
      PAYPAL: "PayPal",
    };
    return labels[method] || method;
  }

  /**
   * Format date
   */
  formatDate(dateString?: string): string {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  /**
   * Format date with time
   */
  formatDateTime(dateString?: string): string {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}

export default new OrderService();