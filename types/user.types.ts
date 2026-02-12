/**
 * User type definitions
 */

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
  enabled: boolean;
  profileImageUrl?: string;
  oauthProvider?: OAuthProvider;
  emailVerified?: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum OAuthProvider {
  LOCAL = "LOCAL",
  GOOGLE = "GOOGLE",
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role?: UserRole;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  path?: string;
}

export interface AuthenticationResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
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