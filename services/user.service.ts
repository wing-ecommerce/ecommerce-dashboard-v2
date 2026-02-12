import api from './api';
import { 
  ApiResponse, 
  PageResponse, 
  User, 
  UpdateUserRequest,
  ChangePasswordRequest,
  UserRole,
  OAuthProvider
} from '@/types/user.types';

class UserService {
  private readonly BASE_URL = '/users';
  private readonly ADMIN_URL = '/admin';

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<User>>(`${this.BASE_URL}/me`);
    return response.data.data;
  }

  /**
   * Get user by ID
   */
  async getById(id: number): Promise<User> {
    const response = await api.get<ApiResponse<User>>(`${this.BASE_URL}/${id}`);
    return response.data.data;
  }

  /**
   * Get user by username
   */
  async getByUsername(username: string): Promise<User> {
    const response = await api.get<ApiResponse<User>>(`${this.BASE_URL}/username/${username}`);
    return response.data.data;
  }

  /**
   * Get all users with pagination (ADMIN only)
   */
  async getAll(
    page: number = 0,
    size: number = 10,
    sortBy: string = "id",
    direction: string = "asc"
  ): Promise<PageResponse<User>> {
    const response = await api.get<ApiResponse<PageResponse<User>>>(
      `${this.BASE_URL}?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`
    );
    return response.data.data;
  }

  /**
   * Search users
   */
  async search(query: string, page: number = 0, size: number = 10): Promise<PageResponse<User>> {
    const response = await api.get<ApiResponse<PageResponse<User>>>(
      `${this.BASE_URL}/search?query=${query}&page=${page}&size=${size}`
    );
    return response.data.data;
  }

  /**
   * Update user
   */
  async update(id: number, data: UpdateUserRequest): Promise<User> {
    const response = await api.put<ApiResponse<User>>(`${this.BASE_URL}/${id}`, data);
    return response.data.data;
  }

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await api.patch<ApiResponse<void>>(`${this.BASE_URL}/change-password`, data);
  }

  /**
   * Delete user
   */
  async delete(id: number): Promise<void> {
    await api.delete<ApiResponse<void>>(`${this.BASE_URL}/${id}`);
  }

  /**
   * Enable user (ADMIN only)
   */
  async enableUser(id: number): Promise<User> {
    const response = await api.patch<ApiResponse<User>>(`${this.ADMIN_URL}/users/${id}/enable`);
    return response.data.data;
  }

  /**
   * Disable user (ADMIN only)
   */
  async disableUser(id: number): Promise<User> {
    const response = await api.patch<ApiResponse<User>>(`${this.ADMIN_URL}/users/${id}/disable`);
    return response.data.data;
  }

  /**
   * Change user role (ADMIN only)
   */
  async changeRole(id: number, role: UserRole): Promise<User> {
    const response = await api.patch<ApiResponse<User>>(
      `${this.ADMIN_URL}/users/${id}/role?role=${role}`
    );
    return response.data.data;
  }

  /**
   * Get users by role (ADMIN only)
   */
  async getByRole(role: UserRole, page: number = 0, size: number = 10): Promise<PageResponse<User>> {
    const response = await api.get<ApiResponse<PageResponse<User>>>(
      `${this.ADMIN_URL}/users/role/${role}?page=${page}&size=${size}`
    );
    return response.data.data;
  }

  /**
   * Get full name of user
   */
  getFullName(user: User): string {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
      return user.firstName;
    } else if (user.lastName) {
      return user.lastName;
    }
    return user.username;
  }

  /**
   * Get user initials for avatar
   */
  getInitials(user: User): string {
    const fullName = this.getFullName(user);
    const parts = fullName.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  }

  /**
   * Check if user is OAuth user
   */
  isOAuthUser(user: User): boolean {
    return user.oauthProvider !== undefined && 
           user.oauthProvider !== null && 
           user.oauthProvider !== "LOCAL";
  }

  /**
   * Get OAuth provider label
   */
  getOAuthProviderLabel(provider?: OAuthProvider): string {
    if (!provider || provider === "LOCAL") return "Email/Password";
    const labels: Record<OAuthProvider, string> = {
      LOCAL: "Email/Password",
      GOOGLE: "Google",
    };
    return labels[provider] || provider;
  }

  /**
   * Format date
   */
  formatDate(dateString?: string): string {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  /**
   * Format date with time
   */
  formatDateTime(dateString?: string): string {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}

export default new UserService();