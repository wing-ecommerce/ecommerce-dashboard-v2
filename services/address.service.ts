import api from './api';
import { ApiResponse, Address } from '@/types/address.types';

class AddressService {
  private readonly BASE_URL = '/addresses';

  /**
   * Get address by ID
   */
  async getById(id: number): Promise<Address> {
    const response = await api.get<ApiResponse<Address>>(`${this.BASE_URL}/${id}`);
    return response.data.data;
  }

  /**
   * Get all addresses for current user
   */
  async getMyAddresses(): Promise<Address[]> {
    const response = await api.get<ApiResponse<Address[]>>(this.BASE_URL);
    return response.data.data;
  }

  /**
   * Get default address
   */
  async getDefault(): Promise<Address> {
    const response = await api.get<ApiResponse<Address>>(`${this.BASE_URL}/default`);
    return response.data.data;
  }

  /**
   * Get addresses for a specific user (Admin only)
   */
  async getUserAddresses(userId: number): Promise<Address[]> {
    const response = await api.get<ApiResponse<Address[]>>(`${this.BASE_URL}/user/${userId}`);
    return response.data.data;
  }

  /**
   * Format address for display
   */
  formatAddress(address: Address): string {
    return `${address.address}, ${address.city}`;
  }

  /**
   * Get full address string
   */
  getFullAddress(address: Address): string {
    return `${address.fullName}\n${address.address}\n${address.city}\n${address.phone}`;
  }
}

export default new AddressService();