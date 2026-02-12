import api from './api';
import { ApiResponse, Category, CategoryRequest, PageResponse } from '@/types/product.types';

class CategoryService {
  private readonly BASE_URL = '/categories';

  /**
   * Get all categories without pagination
   */
  async getAll(): Promise<Category[]> {
    const response = await api.get<ApiResponse<Category[]>>(this.BASE_URL);
    return response.data.data;
  }

  /**
   * Get categories with pagination
   */
  async getAllPaginated(page: number = 0, size: number = 10): Promise<PageResponse<Category>> {
    const response = await api.get<ApiResponse<PageResponse<Category>>>(
      `${this.BASE_URL}?page=${page}&size=${size}`
    );
    return response.data.data;
  }

  /**
   * Get category by ID
   */
  async getById(id: string): Promise<Category> {
    const response = await api.get<ApiResponse<Category>>(`${this.BASE_URL}/${id}`);
    return response.data.data;
  }

  /**
   * Create new category
   */
  async create(data: CategoryRequest): Promise<Category> {
    const response = await api.post<ApiResponse<Category>>(this.BASE_URL, data);
    return response.data.data;
  }

  /**
   * Update category
   */
  async update(id: string, data: CategoryRequest): Promise<Category> {
    const response = await api.put<ApiResponse<Category>>(`${this.BASE_URL}/${id}`, data);
    return response.data.data;
  }

  /**
   * Delete category
   */
  async delete(id: string): Promise<void> {
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
}

export default new CategoryService();