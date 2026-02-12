/**
 * Address Type Definitions
 */

export interface Address {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddressRequest {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  isDefault?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}