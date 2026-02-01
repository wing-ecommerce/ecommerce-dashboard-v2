"use client";

import { useState } from "react";
import { Search, Package, DollarSign, Clock, CheckCircle, Truck } from "lucide-react";

interface Order {
  id: number;
  avatar: string;
  customer: string;
  orderId: string;
  status: "Pending" | "Shipped" | "Delivered";
  products: { name: string; qty: number }[];
  total: number;
  orderDate: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      avatar: "/avatars/john.jpg",
      customer: "John Doe",
      orderId: "#ORD-101",
      status: "Delivered",
      products: [{ name: "Wireless Headphones", qty: 1 }, { name: "Smart Watch", qty: 2 }],
      total: 537.97,
      orderDate: "28 Nov 2023",
    },
    {
      id: 2,
      avatar: "/avatars/jane.jpg",
      customer: "Jane Smith",
      orderId: "#ORD-102",
      status: "Pending",
      products: [{ name: "Running Shoes", qty: 1 }],
      total: 149.50,
      orderDate: "27 Nov 2023",
    },
    {
      id: 3,
      avatar: "/avatars/mike.jpg",
      customer: "Michael Brown",
      orderId: "#ORD-103",
      status: "Shipped",
      products: [{ name: "Laptop Stand", qty: 1 }],
      total: 199.98,
      orderDate: "26 Nov 2023",
    },
    {
      id: 4,
      avatar: "/avatars/emma.jpg",
      customer: "Emma Wilson",
      orderId: "#ORD-104",
      status: "Pending",
      products: [{ name: "Yoga Mat", qty: 1 }, { name: "Water Bottle", qty: 1 }],
      total: 89.99,
      orderDate: "25 Nov 2023",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Shipped" | "Delivered">("All");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOrders = orders.length;
  const totalAmount = orders.reduce((sum, order) => sum + order.total, 0).toFixed(2);

  // Status icon & color
  const getStatusInfo = (status: Order["status"]) => {
    switch (status) {
      case "Delivered":
        return { icon: CheckCircle, color: "text-green-600", label: "Delivered" };
      case "Shipped":
        return { icon: Truck, color: "text-blue-600", label: "Shipped" };
      case "Pending":
        return { icon: Clock, color: "text-yellow-600", label: "Pending" };
      default:
        return { icon: Clock, color: "text-gray-600", label: "Pending" };
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header with Smaller, Clean Total Cards */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Orders Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Orders Card */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex items-center gap-6">
            <div className="p-4 bg-gray-100 rounded-xl">
              <Package className="w-10 h-10 text-gray-700" />
            </div>
            <div>
              <p className="text-gray-600 text-lg mb-1 ">Total Orders</p>
              <h3 className="text-4xl font-bold text-gray-800">{totalOrders}</h3>
            </div>
          </div>

          {/* Total Amount Card */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex items-center gap-6">
            <div className="p-4 bg-gray-100 rounded-xl">
              <DollarSign className="w-10 h-10 text-gray-700" />
            </div>
            <div>
              <p className="text-gray-600 text-lg mb-1">Total Amount</p>
              <h3 className="text-4xl font-bold text-gray-800">${totalAmount}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex justify-end gap-6 mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by customer or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-6 py-3 w-80 border border-gray-300 rounded-full focus:outline-none focus:ring-4 focus:ring-gray-300 shadow-sm"
          />
          <Search className="absolute left-4 top-3.5 w-6 h-6 text-gray-400" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-4 focus:ring-gray-300 shadow-sm"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-8 py-6 text-left text-sm font-semibold text-gray-700">Customer</th>
                <th className="px-8 py-6 text-left text-sm font-semibold text-gray-700">Order ID</th>
                <th className="px-8 py-6 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-8 py-6 text-left text-sm font-semibold text-gray-700">Products</th>
                <th className="px-8 py-6 text-left text-sm font-semibold text-gray-700">Total</th>
                <th className="px-8 py-6 text-left text-sm font-semibold text-gray-700">Order Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-gray-500 text-xl">
                    No orders found matching your search.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const StatusIcon = getStatusInfo(order.status).icon;
                  const statusColor = getStatusInfo(order.status).color;

                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-all duration-200">
                      <td className="px-8 py-7">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-gray-200 rounded-full border-2 border-dashed" />
                          <p className="font-semibold text-gray-900 text-lg">{order.customer}</p>
                        </div>
                      </td>
                      <td className="px-8 py-7 text-gray-600 font-medium">{order.orderId}</td>
                      <td className="px-8 py-7">
                        <div className="flex items-center gap-3">
                          <StatusIcon className={`w-6 h-6 ${statusColor}`} />
                          <span className="font-medium text-gray-800">{order.status}</span>
                        </div>
                      </td>
                      <td className="px-8 py-7">
                        <div className="space-y-2">
                          {order.products.map((p, i) => (
                            <p key={i} className="text-gray-700">
                              {p.name} <span className="text-gray-500">× {p.qty}</span>
                            </p>
                          ))}
                        </div>
                      </td>
                      <td className="px-8 py-7 font-bold text-xl text-gray-900">${order.total.toFixed(2)}</td>
                      <td className="px-8 py-7 text-gray-600">{order.orderDate}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-6 border-t border-gray-200 flex items-center justify-between text-gray-600">
          <div className="text-sm">Showing 1 to {filteredOrders.length} of {orders.length} orders</div>
          <div className="flex items-center gap-3">
            <button className="px-5 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition">&lt;</button>
            <button className="px-5 py-3 rounded-lg bg-gray-800 text-white">1</button>
            <button className="px-5 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper to get icon and color for status
function getStatusInfo(status: Order["status"]) {
  switch (status) {
    case "Delivered":
      return { icon: CheckCircle, color: "text-green-600" };
    case "Shipped":
      return { icon: Truck, color: "text-blue-600" };
    case "Pending":
      return { icon: Clock, color: "text-yellow-600" };
    default:
      return { icon: Clock, color: "text-gray-600" };
  }
}