/**
 * Product and Category Type Definitions
 */

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryRequest {
  name: string;
  slug: string;
}

// Product Size Types
export interface ProductSize {
  id: number;
  size: string;
  stock: number;
  priceOverride?: number;
  sku?: string;
  effectivePrice: number;
}

export interface SizeRequest {
  size: string;
  stock: number;
  priceOverride?: number;
  sku?: string;
}

// Product Types
export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image?: string;
  additionalPhotos?: string[];
  description?: string;
  stock: number; // Total stock across all sizes
  sizes: ProductSize[];
  categoryId: string;
  categoryName: string;
}

export interface ProductRequest {
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image?: string;
  additionalPhotos?: string[];
  description?: string;
  categoryId: string;
  sizes: SizeRequest[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
  path?: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

// Form Types for UI
export interface ProductFormData {
  name: string;
  slug: string;
  price: string;
  originalPrice: string;
  discount: string;
  image: string;
  additionalPhotos: string[];
  description: string;
  categoryId: string;
  sizes: {
    size: string;
    stock: string;
    priceOverride: string;
    sku: string;
  }[];
}

export interface CategoryFormData {
  name: string;
  slug: string;
}