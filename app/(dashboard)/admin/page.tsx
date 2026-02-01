"use client";

import { useState } from "react";
import { Users, Monitor } from "lucide-react";

export default function AdminHome() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // "All", "Active", "Inactive"

  const customers = [
    { name: "Jane Cooper", company: "Microsoft", phone: "(225) 555-0118", email: "jane@microsoft.com", country: "United States", status: "Active" },
    { name: "Floyd Miles", company: "Yahoo", phone: "(205) 555-0100", email: "floyd@yahoo.com", country: "Kiribati", status: "Inactive" },
    { name: "Ronald Richards", company: "Adobe", phone: "(302) 555-0107", email: "ronald@adobe.com", country: "Israel", status: "Inactive" },
    { name: "Marvin McKinney", company: "Tesla", phone: "(252) 555-0126", email: "marvin@tesla.com", country: "Iran", status: "Active" },
  ];

  // Filter logic
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 bg-gray-50 p-8 overflow-y-auto">
      {/* Greeting & Search */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Hello Admin 👋,</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-full w-80 shadow-sm focus:outline-none focus:ring-4 focus:ring-purple-300 transition"
          />
          <svg className="absolute left-4 top-3.5 w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Total Customers */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl shadow-lg border border-green-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500 rounded-xl shadow-md">
              <Users className="w-8 h-8 text-white" />
            </div>
            <span className="text-xl font-bold text-green-600">↑16%</span>
          </div>
          <p className="text-gray-600 text-sm mb-1">Total Customers</p>
          <h3 className="text-3xl font-bold text-gray-800">5,423</h3>
        </div>

        {/* Members */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-100 p-6 rounded-2xl shadow-lg border border-purple-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500 rounded-xl shadow-md">
              <Users className="w-8 h-8 text-white" />
            </div>
            <span className="text-xl font-bold text-red-600">↓1%</span>
          </div>
          <p className="text-gray-600 text-sm mb-1">Members</p>
          <h3 className="text-3xl font-bold text-gray-800">1,893</h3>
        </div>

        {/* Active Now */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-6 rounded-2xl shadow-lg border border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500 rounded-xl shadow-md">
              <Monitor className="w-8 h-8 text-white" />
            </div>
            <div className="flex -space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-pink-400 to-red-500 rounded-full border-3 border-white shadow" />
              <div className="w-9 h-9 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full border-3 border-white shadow" />
              <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-teal-500 rounded-full border-3 border-white shadow" />
              <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-3 border-white shadow flex items-center justify-center text-white text-sm font-bold">
                +5
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Active Now</p>
          <h3 className="text-3xl font-bold text-gray-800">189</h3>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">All Customers</h2>
            <p className="text-green-600 text-lg mt-1">Active Members</p>
          </div>
          <div className="flex items-center gap-6 flex-wrap">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-3 border border-gray-300 rounded-2xl w-72 focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-md"
              />
              <svg className="absolute left-4 top-4 w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-6 py-3 border border-gray-300 rounded-2xl shadow-md focus:outline-none focus:ring-4 focus:ring-purple-300"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">Customer Name</th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">Company</th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">Phone Number</th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">Country</th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-gray-500">
                    No customers found matching your search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer, i) => (
                  <tr key={i} className="hover:bg-purple-50/30 transition-all">
                    <td className="px-8 py-6 font-semibold text-gray-900">{customer.name}</td>
                    <td className="px-8 py-6 text-gray-600">{customer.company}</td>
                    <td className="px-8 py-6 text-gray-600">{customer.phone}</td>
                    <td className="px-8 py-6 text-gray-600">{customer.email}</td>
                    <td className="px-8 py-6 text-gray-600">{customer.country}</td>
                    <td className="px-8 py-6">
                      <span className={`px-5 py-2 rounded-full text-sm font-bold shadow-sm ${
                        customer.status === "Active" 
                          ? "bg-green-100 text-green-700 border border-green-300" 
                          : "bg-red-100 text-red-700 border border-red-300"
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
