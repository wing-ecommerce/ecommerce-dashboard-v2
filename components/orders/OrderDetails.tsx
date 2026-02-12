"use client";

import { useState } from "react";
import { X, Package, MapPin, CreditCard, Calendar, Truck, CheckCircle, Loader2 } from "lucide-react";
import orderService from "@/services/order.service";
import { Order, OrderStatus } from "@/types/order.types";

interface OrderDetailsProps {
  order: Order;
  onClose: () => void;
  onStatusUpdate: (orderId: number, status: OrderStatus) => void;
  onDelete: (orderId: number) => void;
}

export default function OrderDetails({ order, onClose, onStatusUpdate, onDelete }: OrderDetailsProps) {
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status);

  const handleStatusUpdate = async () => {
    if (selectedStatus === order.status) return;
    
    setUpdating(true);
    try {
      await onStatusUpdate(order.id, selectedStatus);
      onClose();
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = () => {
    onDelete(order.id);
    onClose();
  };

  const statusColor = orderService.getStatusColor(order.status);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            <p className="text-gray-600 mt-1">{order.orderNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status & Payment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-800">Order Status</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-${statusColor}-100 text-${statusColor}-800`}>
                  {orderService.getStatusLabel(order.status)}
                </span>
                <span className={`text-sm font-medium ${
                  order.paymentStatus === "PAID" ? "text-green-600" : "text-yellow-600"
                }`}>
                  • {order.paymentStatus}
                </span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-800">Payment Method</h3>
              </div>
              <p className="text-gray-700">{orderService.getPaymentMethodLabel(order.paymentMethod)}</p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Date */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-800">Order Date</h3>
              </div>
              <p className="text-gray-700">{orderService.formatDateTime(order.createdAt)}</p>
            </div>

            {/* Estimated Delivery */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-800">
                  {order.deliveredAt ? "Delivered" : "Estimated Delivery"}
                </h3>
              </div>
              <p className="text-gray-700">
                {order.deliveredAt 
                  ? orderService.formatDateTime(order.deliveredAt)
                  : orderService.formatDate(order.estimatedDelivery)}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-800">Order Items ({order.totalItems})</h3>
            </div>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  {item.productImage ? (
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.productName}</p>
                    <p className="text-sm text-gray-600">Size: {item.sizeName}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${item.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span>${order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-800 mb-2">Notes</h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{order.notes}</p>
            </div>
          )}

          {/* Update Status (ADMIN) */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-800 mb-4">Update Status</h3>
            <div className="flex items-center gap-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
                disabled={updating}
              >
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="RETURNED">Returned</option>
              </select>
              <button
                onClick={handleStatusUpdate}
                disabled={updating || selectedStatus === order.status}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
              >
                {updating && <Loader2 className="w-4 h-4 animate-spin" />}
                {updating ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="px-6 py-3 text-red-600 hover:bg-red-50 rounded-lg font-semibold"
          >
            Delete Order
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}