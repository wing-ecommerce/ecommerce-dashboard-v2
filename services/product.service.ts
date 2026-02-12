import api from './api';
import { ApiResponse, Product, ProductRequest, PageResponse } from '@/types/product.types';

class ProductService {
  private readonly BASE_URL = '/products';

  /**
   * Get all products without pagination
   */
  async getAll(): Promise<Product[]> {
    const response = await api.get<ApiResponse<Product[]>>(this.BASE_URL);
    return response.data.data;
  }

  /**
   * Get products with pagination
   */
  async getAllPaginated(page: number = 0, size: number = 10): Promise<PageResponse<Product>> {
    const response = await api.get<ApiResponse<PageResponse<Product>>>(
      `${this.BASE_URL}?page=${page}&size=${size}`
    );
    return response.data.data;
  }

  /**
   * Get product by ID
   */
  async getById(id: number): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(`${this.BASE_URL}/${id}`);
    return response.data.data;
  }

  /**
   * Get products by category with pagination
   */
  async getByCategory(categoryId: string, page: number = 0, size: number = 10): Promise<PageResponse<Product>> {
    const response = await api.get<ApiResponse<PageResponse<Product>>>(
      `${this.BASE_URL}/category/${categoryId}?page=${page}&size=${size}`
    );
    return response.data.data;
  }

  /**
   * Get all products by category (no pagination)
   */
  async getAllByCategory(categoryId: string): Promise<Product[]> {
    const response = await api.get<ApiResponse<Product[]>>(
      `${this.BASE_URL}/category/${categoryId}/all`
    );
    return response.data.data;
  }

  /**
   * Create new product
   */
  async create(data: ProductRequest): Promise<Product> {
    const response = await api.post<ApiResponse<Product>>(this.BASE_URL, data);
    return response.data.data;
  }

  /**
   * Update product (PUT - full replacement, all fields required)
   */
  async update(id: number, data: ProductRequest): Promise<Product> {
    const response = await api.put<ApiResponse<Product>>(`${this.BASE_URL}/${id}`, data);
    return response.data.data;
  }

  /**
   * Patch product (PATCH - partial update, only changed fields) ✨ NEW
   */
  async patch(id: number, data: Partial<ProductRequest>): Promise<Product> {
    const response = await api.patch<ApiResponse<Product>>(`${this.BASE_URL}/${id}`, data);
    return response.data.data;
  }

  /**
   * Delete product
   */
  async delete(id: number): Promise<void> {
    await api.delete<ApiResponse<string>>(`${this.BASE_URL}/${id}`);
  }

  /**
   * Generate slug from name
   */
  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  /**
   * Calculate discount percentage
   */
  calculateDiscount(originalPrice: number, currentPrice: number): number {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }

  /**
   * Validate product data before submission
   */
  validateProduct(data: ProductRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length < 2) {
      errors.push('Product name must be at least 2 characters');
    }

    if (!data.slug || !/^[a-z0-9-]+$/.test(data.slug)) {
      errors.push('Slug must be lowercase alphanumeric with hyphens only');
    }

    if (!data.price || data.price <= 0) {
      errors.push('Price must be greater than 0');
    }

    if (!data.categoryId) {
      errors.push('Category is required');
    }

    if (!data.sizes || data.sizes.length === 0) {
      errors.push('At least one size variant is required');
    } else {
      data.sizes.forEach((size, index) => {
        if (!size.size || size.size.trim().length === 0) {
          errors.push(`Size #${index + 1}: Size name is required`);
        }
        if (size.stock === undefined || size.stock < 0) {
          errors.push(`Size #${index + 1}: Stock must be 0 or greater`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export default new ProductService();