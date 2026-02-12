"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, AlertCircle, X, Package, DollarSign } from "lucide-react";
import orderService from "@/services/order.service";
import OrderDetails from "@/components/orders/OrderDetails";
import { Order, OrderStatus } from "@/types/order.types";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    loadOrders();
  }, [currentPage]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await orderService.getAll(currentPage, 10);
      setOrders(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: number, newStatus: OrderStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      await loadOrders();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      await orderService.delete(orderId);
      await loadOrders();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete order");
    }
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const closeOrderDetails = () => {
    setIsDetailsOpen(false);
    setSelectedOrder(null);
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header with Stats */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Orders Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Orders */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex items-center gap-6">
            <div className="p-4 bg-blue-100 rounded-xl">
              <Package className="w-10 h-10 text-blue-700" />
            </div>
            <div>
              <p className="text-gray-600 text-lg mb-1">Total Orders</p>
              <h3 className="text-4xl font-bold text-gray-800">{totalElements}</h3>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex items-center gap-6">
            <div className="p-4 bg-green-100 rounded-xl">
              <DollarSign className="w-10 h-10 text-green-700" />
            </div>
            <div>
              <p className="text-gray-600 text-lg mb-1">Total Revenue</p>
              <h3 className="text-4xl font-bold text-gray-800">${totalRevenue.toFixed(2)}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
          <button onClick={() => setError("")} className="text-red-600 hover:text-red-800">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 text-sm text-gray-700 font-medium">
          <span>Total: {totalElements} orders</span>
          <span>•</span>
          <span>Page: {currentPage + 1} of {totalPages}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by order number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 text-gray-900 placeholder:text-gray-500"
            />
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "ALL")}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="RETURNED">Returned</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Order</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Items</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusColor = orderService.getStatusColor(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                          <p className="text-xs text-gray-600">ID: {order.id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${statusColor}-100 text-${statusColor}-800`}>
                          {orderService.getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-gray-800 font-medium">{order.totalItems} items</td>
                      <td className="px-6 py-5 font-bold text-gray-900">${order.total.toFixed(2)}</td>
                      <td className="px-6 py-5">
                        <p className="text-sm text-gray-700">{orderService.getPaymentMethodLabel(order.paymentMethod)}</p>
                        <p className={`text-xs font-medium ${
                          order.paymentStatus === "PAID" ? "text-green-600" : "text-yellow-600"
                        }`}>
                          {order.paymentStatus}
                        </p>
                      </td>
                      <td className="px-6 py-5 text-gray-600 text-sm">
                        {orderService.formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => openOrderDetails(order)}
                          className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition font-semibold text-sm"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700 font-medium">
            Showing {filteredOrders.length} of {totalElements} orders
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              Previous
            </button>
            <span className="text-gray-700 font-medium">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {isDetailsOpen && selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={closeOrderDetails}
          onStatusUpdate={handleStatusUpdate}
          onDelete={handleDeleteOrder}
        />
      )}
    </div>
  );
}