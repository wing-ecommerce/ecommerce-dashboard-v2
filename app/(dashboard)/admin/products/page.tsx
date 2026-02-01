"use client";

import { useState } from "react";
import { MoreVertical, Plus, Search } from "lucide-react";

interface Product {
  id: number;
  avatar: string;
  name: string;
  category: string;
  status: "Active" | "Inactive";
  colors: string[];
  stock: number;
  lastUpdated: string;
  inStock: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, avatar: "/products/1.jpg", name: "Wireless Headphones", category: "Electronics", status: "Active", colors: ["Black", "White"], stock: 120, lastUpdated: "28 Nov 2023", inStock: true },
    { id: 2, avatar: "/products/2.jpg", name: "Smart Watch", category: "Wearables", status: "Active", colors: ["Black", "Silver"], stock: 45, lastUpdated: "23 Nov 2023", inStock: true },
    { id: 3, avatar: "/products/3.jpg", name: "Running Shoes", category: "Footwear", status: "Inactive", colors: ["Red", "Blue"], stock: 0, lastUpdated: "19 Nov 2023", inStock: false },
    { id: 4, avatar: "/products/4.jpg", name: "Laptop Stand", category: "Accessories", status: "Active", colors: ["Silver"], stock: 78, lastUpdated: "27 Nov 2023", inStock: true },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", category: "", stock: "", status: "Active" as "Active" | "Inactive", inStock: true });

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleStock = (id: number) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        const newInStock = !p.inStock;
        return { ...p, inStock: newInStock, status: newInStock ? "Active" : "Inactive" };
      }
      return p;
    }));
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setForm({
        name: product.name,
        category: product.category,
        stock: product.stock.toString(),
        status: product.status,
        inStock: product.inStock,
      });
    } else {
      setEditingProduct(null);
      setForm({ name: "", category: "", stock: "", status: "Active", inStock: true });
    }
    setIsModalOpen(true);
    setOpenDropdown(null); // Close dropdown when opening modal
  };

  const saveProduct = () => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, name: form.name, category: form.category, stock: Number(form.stock), status: form.status, inStock: form.inStock } : p));
    } else {
      const newProduct: Product = {
        id: Math.max(...products.map(p => p.id), 0) + 1,
        avatar: "/products/new.jpg",
        name: form.name,
        category: form.category,
        status: form.status,
        colors: ["Black"],
        stock: Number(form.stock),
        lastUpdated: new Date().toLocaleDateString('en-GB'),
        inStock: form.inStock,
      };
      setProducts([...products, newProduct]);
    }
    setIsModalOpen(false);
  };

  const deleteProduct = (id: number) => {
    if (confirm("Delete this product?")) {
      setProducts(products.filter(p => p.id !== id));
    }
    setOpenDropdown(null);
  };

  const deleteAll = () => {
    if (confirm("Delete ALL products?")) {
      setProducts([]);
    }
  };

  const getColorCircle = (color: string) => {
    const map: Record<string, string> = {
      Black: "bg-black",
      White: "bg-white border-2 border-gray-300",
      Blue: "bg-blue-600",
      Red: "bg-red-600",
      Silver: "bg-gray-400",
    };
    return map[color] || "bg-gray-500";
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Products Management</h1>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition">
          <Plus className="w-5 h-5" />
          Add new product
        </button>
      </div>

      {/* Bulk Actions & Search + Filter */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 text-sm text-gray-600">
          <button onClick={deleteAll} className="text-red-600 hover:text-red-800">Delete all</button>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "All" | "Active" | "Inactive")}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Colors</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">In Stock</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Last Updated</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg border-2 border-dashed" />
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-gray-600">{product.category}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${product.status === "Active" ? "bg-green-500" : "bg-red-500"}`} />
                      <span className="text-sm text-gray-600">{product.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-2">
                      {product.colors.map((color, i) => (
                        <div key={i} className={`w-6 h-6 rounded-full ${getColorCircle(color)} shadow`} title={color} />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <button
                      onClick={() => toggleStock(product.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${product.inStock ? "bg-blue-600" : "bg-gray-300"}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${product.inStock ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                  </td>
                  <td className="px-6 py-5 text-gray-900 font-medium">{product.stock}</td>
                  <td className="px-6 py-5 text-gray-600">{product.lastUpdated}</td>
                  <td className="px-6 py-5 text-right relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(openDropdown === product.id ? null : product.id);
                      }}
                      className="text-gray-500 hover:text-gray-700 p-1 rounded"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {/* Dropdown */}
                    {openDropdown === product.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 py-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal(product);
                          }}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteProduct(product.id);
                          }}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
          <div>Showing 1 to {filteredProducts.length} of {products.length}</div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100">&lt;</button>
            <button className="px-3 py-1 rounded bg-blue-600 text-white">1</button>
            <button className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100">&gt;</button>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6">{editingProduct ? "Edit" : "Add New"} Product</h2>
            <div className="space-y-5">
              <input
                type="text"
                placeholder="Product Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Stock Quantity"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as "Active" | "Inactive" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.inStock}
                  onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span>In Stock</span>
              </label>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg">
                Cancel
              </button>
              <button onClick={saveProduct} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {editingProduct ? "Update" : "Add"} Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getColorCircle(color: string) {
  const map: Record<string, string> = {
    Black: "bg-black",
    White: "bg-white border-2 border-gray-300",
    Blue: "bg-blue-600",
    Red: "bg-red-600",
    Silver: "bg-gray-400",
  };
  return map[color] || "bg-gray-500";
}