"use client";

import { useState, useEffect } from "react";
import { MoreVertical, Plus, Search, Loader2, AlertCircle, Edit, Trash2, X, Package } from "lucide-react";
import categoryService from "@/services/category.service";
import { Category, CategoryFormData } from "@/types/product.types";

export default function CategoriesPage() {
  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryFormData>({
    name: "",
    slug: "",
  });

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load categories");
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter categories
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Auto-generate slug when name changes
  const handleNameChange = (name: string) => {
    setForm({
      ...form,
      name,
      slug: categoryService.generateSlug(name),
    });
  };

  // Open modal for add/edit
  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setForm({
        name: category.name,
        slug: category.slug,
      });
    } else {
      setEditingCategory(null);
      setForm({
        name: "",
        slug: "",
      });
    }
    setIsModalOpen(true);
    setOpenDropdown(null);
  };

  // Save category (create or update)
  const saveCategory = async () => {
    try {
      setSaving(true);
      setError("");

      // Validate
      if (!form.name || form.name.trim().length < 2) {
        setError("Category name must be at least 2 characters");
        return;
      }

      if (!form.slug || !/^[a-z0-9-]+$/.test(form.slug)) {
        setError("Slug must be lowercase alphanumeric with hyphens only");
        return;
      }

      // Create or update
      if (editingCategory) {
        await categoryService.update(editingCategory.id, form);
      } else {
        await categoryService.create(form);
      }

      // Reload and close
      await loadCategories();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save category");
      console.error("Error saving category:", err);
    } finally {
      setSaving(false);
    }
  };

  // Delete category
  const deleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? This will affect all products in this category.")) {
      return;
    }

    try {
      setError("");
      await categoryService.delete(id);
      await loadCategories();
      setOpenDropdown(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete category");
      console.error("Error deleting category:", err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Categories Management</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          Add new category
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

      {/* Search */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 text-sm text-gray-700 font-medium">
          <span>Total: {categories.length} categories</span>
          <span>•</span>
          <span>Filtered: {filteredCategories.length}</span>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 text-gray-900 placeholder:text-gray-500"
          />
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Products</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No categories found
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <p className="font-semibold text-gray-900">{category.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <code className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm font-mono font-medium">
                        {category.slug}
                      </code>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">
                        {category.productCount} products
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdown(openDropdown === category.id ? null : category.id);
                        }}
                        className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {openDropdown === category.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 py-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal(category);
                            }}
                            className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center gap-2 font-medium"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteCategory(category.id);
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
          <div>
            Showing {filteredCategories.length} of {categories.length} categories
          </div>
          <button
            onClick={loadCategories}
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition font-semibold"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => !saving && setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              {editingCategory ? "Edit" : "Add New"} Category
            </h2>

            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., T-Shirts"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
                  disabled={saving}
                  autoFocus
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Slug * (auto-generated)
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm text-gray-900"
                  disabled={saving}
                />
                <p className="mt-1 text-xs text-gray-600 font-medium">
                  Lowercase letters, numbers, and hyphens only
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50 font-semibold"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={saveCategory}
                disabled={saving}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? "Saving..." : editingCategory ? "Update" : "Create"} Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}