"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, CheckCircle, Clock, MoreVertical } from "lucide-react";

type Customer = {
  id: number;
  name: string;
  company: string;
  phone: string;
  email: string;
  country: string;
  status: "Active" | "Inactive";
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 1,
      name: "Jane Cooper",
      company: "Microsoft",
      phone: "(225) 555-0118",
      email: "jane@microsoft.com",
      country: "United States",
      status: "Active",
    },
    {
      id: 2,
      name: "John Doe",
      company: "Apple Inc.",
      phone: "(671) 555-0123",
      email: "john@apple.com",
      country: "United States",
      status: "Active",
    },
    {
      id: 3,
      name: "Sarah Johnson",
      company: "Google",
      phone: "(305) 555-0199",
      email: "sarah@google.com",
      country: "Canada",
      status: "Inactive",
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    country: "",
    status: "Active" as "Active" | "Inactive",
  });

  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const openModal = (customer?: Customer) => {
    if (customer) {
      setEditing(customer);
      setForm({
        name: customer.name,
        company: customer.company,
        phone: customer.phone,
        email: customer.email,
        country: customer.country,
        status: customer.status,
      });
    } else {
      setEditing(null);
      setForm({ name: "", company: "", phone: "", email: "", country: "", status: "Active" });
    }
    setIsOpen(true);
    setOpenDropdownId(null); // Close dropdown when opening modal
  };

  const saveCustomer = () => {
    if (!form.name || !form.email) {
      alert("Name and Email are required!");
      return;
    }

    if (editing) {
      setCustomers(customers.map((c) => (c.id === editing.id ? { ...c, ...form } : c)));
    } else {
      const newCustomer = { id: Math.max(...customers.map((c) => c.id), 0) + 1, ...form };
      setCustomers([...customers, newCustomer]);
    }
    setIsOpen(false);
  };

  const deleteCustomer = (id: number) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      setCustomers(customers.filter((c) => c.id !== id));
      setOpenDropdownId(null); // Close dropdown after delete
    }
  };

  const toggleDropdown = (id: number) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Customers Management</h1>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-3 bg-green-600 text-white px-6 py-4 rounded-xl hover:bg-green-700 transition shadow-lg font-medium"
          >
            <Plus className="w-6 h-6" />
            Add Customer
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">Customer Name</th>
                  <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">Company</th>
                  <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">Phone Number</th>
                  <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">Country</th>
                  <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-8 py-5 text-center text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition duration-200">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-lg shadow-md">
                          {customer.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <span className="font-semibold text-gray-900">{customer.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-gray-700">{customer.company}</td>
                    <td className="px-8 py-6 text-gray-600">{customer.phone}</td>
                    <td className="px-8 py-6 text-gray-700">{customer.email}</td>
                    <td className="px-8 py-6 text-gray-600">{customer.country}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        {customer.status === "Active" ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                              Active
                            </span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-5 h-5 text-orange-600" />
                            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                              Inactive
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 relative">
                      <div className="flex justify-center">
                        <button
                          onClick={() => toggleDropdown(customer.id)}
                          className="p-2 rounded-lg hover:bg-gray-200 transition"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>

                      {/* Dropdown Menu - Visible only when clicked */}
                      {openDropdownId === customer.id && (
                        <div className="absolute right-8 top-14 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 z-20 py-2">
                          <button
                            onClick={() => openModal(customer)}
                            className="w-full text-left px-5 py-3 flex items-center gap-3 hover:bg-gray-50 transition"
                          >
                            <Pencil className="w-4 h-4 text-blue-600" />
                            <span className="text-gray-700 font-medium">Edit</span>
                          </button>
                          <button
                            onClick={() => deleteCustomer(customer.id)}
                            className="w-full text-left px-5 py-3 flex items-center gap-3 hover:bg-gray-50 transition text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="font-medium">Delete</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Click outside to close dropdown */}
        {openDropdownId && (
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpenDropdownId(null)}
          />
        )}

        {/* Add/Edit Modal */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {editing ? "Edit Customer" : "Add New Customer"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Customer Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Company"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="(XXX) XXX-XXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="email@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as "Active" | "Inactive" })}
                    className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-10">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-8 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={saveCustomer}
                  className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-medium shadow-md"
                >
                  {editing ? "Update Customer" : "Add Customer"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}