"use client";

import { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";
import productService from "@/services/product.service";
import { Product, Category, ProductFormData } from "@/types/product.types";

interface ProductFormProps {
  product?: Product | null;
  categories: Category[];
  onSave: () => void;
  onCancel: () => void;
}

export default function ProductForm({ product, categories, onSave, onCancel }: ProductFormProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<ProductFormData>({
    name: "",
    slug: "",
    price: "",
    originalPrice: "",
    discount: "",
    image: "",
    description: "",
    categoryId: "",
    sizes: [{ size: "M", stock: "0", priceOverride: "", sku: "" }],
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        slug: product.slug,
        price: product.price.toString(),
        originalPrice: product.originalPrice?.toString() || "",
        discount: product.discount?.toString() || "",
        image: product.image || "",
        description: product.description || "",
        categoryId: product.categoryId,
        sizes: product.sizes.map(s => ({
          size: s.size,
          stock: s.stock.toString(),
          priceOverride: s.priceOverride?.toString() || "",
          sku: s.sku || `${product.slug}-${s.size.toLowerCase()}`,
        })),
      });
    } else {
      setForm({
        name: "",
        slug: "",
        price: "",
        originalPrice: "",
        discount: "",
        image: "",
        description: "",
        categoryId: categories[0]?.id || "",
        sizes: [{ size: "M", stock: "0", priceOverride: "", sku: "" }],
      });
    }
  }, [product, categories]);

  const handleNameChange = (name: string) => {
    const newSlug = productService.generateSlug(name);
    setForm({
      ...form,
      name,
      slug: newSlug,
      sizes: form.sizes.map(size => ({
        ...size,
        sku: size.size ? `${newSlug}-${size.size.toLowerCase()}` : ""
      }))
    });
  };

  const handlePriceChange = (price: string, originalPrice: string) => {
    const priceNum = parseFloat(price);
    const originalPriceNum = parseFloat(originalPrice);
    let discount = "";
    
    if (priceNum && originalPriceNum && originalPriceNum > priceNum) {
      discount = Math.round(((originalPriceNum - priceNum) / originalPriceNum) * 100).toString();
    }
    
    setForm({ ...form, price, originalPrice, discount });
  };

  const handleDiscountChange = (discount: string) => {
    const discountNum = parseFloat(discount);
    const originalPriceNum = parseFloat(form.originalPrice);
    let price = form.price;
    
    if (discountNum && originalPriceNum) {
      price = (originalPriceNum - (originalPriceNum * (discountNum / 100))).toFixed(2);
    }
    
    setForm({ ...form, discount, price });
  };

  const addSize = () => {
    setForm({
      ...form,
      sizes: [...form.sizes, { size: "", stock: "0", priceOverride: "", sku: "" }],
    });
  };

  const removeSize = (index: number) => {
    if (form.sizes.length > 1) {
      setForm({
        ...form,
        sizes: form.sizes.filter((_, i) => i !== index),
      });
    }
  };

  const updateSize = (index: number, field: string, value: string) => {
    const newSizes = [...form.sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
    
    if (field === "size" && value && form.slug) {
      newSizes[index].sku = `${form.slug}-${value.toLowerCase()}`;
    }
    
    setForm({ ...form, sizes: newSizes });
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError("");

      // ✨ FIX: Convert empty strings to undefined/null for optional fields
      const productData = {
        name: form.name,
        slug: form.slug,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
        discount: form.discount ? parseInt(form.discount) : undefined,
        image: form.image || undefined,
        description: form.description || undefined,
        categoryId: form.categoryId,
        sizes: form.sizes.map(s => ({
          size: s.size,
          stock: parseInt(s.stock) || 0,
          priceOverride: s.priceOverride && s.priceOverride.trim() !== "" ? parseFloat(s.priceOverride) : undefined,
          sku: s.sku && s.sku.trim() !== "" ? s.sku : undefined,
        })),
      };

      const validation = productService.validateProduct(productData);
      if (!validation.valid) {
        setError(validation.errors.join(", "));
        return;
      }

      if (product) {
        await productService.patch(product.id, productData);
      } else {
        await productService.create(productData);
      }

      onSave();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to save product";
      setError(errorMsg);
      console.error("Save error:", err);
      console.error("Error response:", err.response);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        {product ? "Edit" : "Add New"} Product
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Product Name *</label>
          <input
            type="text"
            placeholder="e.g., Classic White T-Shirt"
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
            disabled={saving}
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Slug * (auto-generated)</label>
          <input
            type="text"
            value={form.slug}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm text-gray-900 bg-gray-50"
            disabled
            readOnly
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Category *</label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
            disabled={saving}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Price, Original Price, Discount */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Price * ($)</label>
            <input
              type="number"
              step="0.01"
              placeholder="29.99"
              value={form.price}
              onChange={(e) => handlePriceChange(e.target.value, form.originalPrice)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Original Price ($)</label>
            <input
              type="number"
              step="0.01"
              placeholder="39.99"
              value={form.originalPrice}
              onChange={(e) => handlePriceChange(form.price, e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Discount (%) 🔄</label>
            <input
              type="number"
              placeholder="20"
              value={form.discount}
              onChange={(e) => handleDiscountChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder:text-gray-500 bg-green-50"
              disabled={saving}
            />
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Image URL</label>
          <input
            type="text"
            placeholder="https://example.com/image.jpg"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
            disabled={saving}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Description</label>
          <textarea
            placeholder="Product description..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
            disabled={saving}
          />
        </div>

        {/* Sizes */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-semibold text-gray-800">Sizes *</label>
            <button
              type="button"
              onClick={addSize}
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
              disabled={saving}
            >
              + Add Size
            </button>
          </div>
          <div className="space-y-3">
            {form.sizes.map((size, index) => (
              <div key={index} className="flex gap-3 items-start">
                <input
                  type="text"
                  placeholder="Size"
                  value={size.size}
                  onChange={(e) => updateSize(index, "size", e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
                  disabled={saving}
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={size.stock}
                  onChange={(e) => updateSize(index, "stock", e.target.value)}
                  className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
                  disabled={saving}
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price override"
                  value={size.priceOverride}
                  onChange={(e) => updateSize(index, "priceOverride", e.target.value)}
                  className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
                  disabled={saving}
                />
                <input
                  type="text"
                  placeholder="SKU (auto)"
                  value={size.sku}
                  onChange={(e) => updateSize(index, "sku", e.target.value)}
                  className="w-40 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder:text-gray-500 bg-green-50 font-mono text-xs"
                  disabled={saving}
                />
                {form.sizes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSize(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    disabled={saving}
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4 mt-8">
        <button
          onClick={onCancel}
          className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50 font-semibold"
          disabled={saving}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? "Saving..." : product ? "Update" : "Create"} Product
        </button>
      </div>
    </div>
  );
}