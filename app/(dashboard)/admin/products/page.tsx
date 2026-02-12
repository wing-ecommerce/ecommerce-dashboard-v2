"use client";

import { useState, useEffect } from "react";
import { MoreVertical, Plus, Search, Loader2, AlertCircle, Edit, Trash2, X } from "lucide-react";
import productService from "@/services/product.service";
import categoryService from "@/services/category.service";
import ProductForm from "@/components/products/ProductForm";
import { Product, Category } from "@/types/product.types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || product.categoryId === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const openModal = (product?: Product) => {
    setEditingProduct(product || null);
    setIsModalOpen(true);
    setOpenDropdown(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSave = async () => {
    await loadData();
    closeModal();
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      setError("");
      await productService.delete(id);
      await loadData();
      setOpenDropdown(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Products Management</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          Add new product
        </button>
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
          <span>Total: {products.length} products</span>
          <span>•</span>
          <span>Filtered: {filteredProducts.length}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 text-gray-900 placeholder:text-gray-500"
            />
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Sizes</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total Stock</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No img</span>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-600 font-mono">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-gray-800 font-medium">{product.categoryName}</td>
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-bold text-gray-900">${product.price.toFixed(2)}</p>
                        {product.originalPrice && (
                          <p className="text-xs text-gray-600 line-through font-medium">
                            ${product.originalPrice.toFixed(2)}
                          </p>
                        )}
                        {product.discount && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-800 text-xs font-bold rounded">
                            -{product.discount}%
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1">
                        {product.sizes.map((size) => (
                          <span
                            key={size.id}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded"
                            title={`${size.size}: ${size.stock} in stock`}
                          >
                            {size.size}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          product.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdown(openDropdown === product.id ? null : product.id);
                        }}
                        className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {openDropdown === product.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 py-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal(product);
                            }}
                            className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center gap-2 font-medium"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteProduct(product.id);
                            }}
                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Stats */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-700 font-medium">
          <div>Showing {filteredProducts.length} of {products.length} products</div>
          <button onClick={loadData} className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition font-semibold">
            Refresh
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <ProductForm
              product={editingProduct}
              categories={categories}
              onSave={handleSave}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}