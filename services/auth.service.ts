import api from './api';

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    token_type: string;
    expires_in: number;
    user: {
      id: number;
      username: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      enabled: boolean;
      profileImageUrl?: string;
      oauthProvider?: string;
      emailVerified?: boolean;
      createdAt: string;
      updatedAt: string;
      lastLogin?: string;
    };
  };
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    token_type: string;
    expires_in: number;
  };
}

class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly USER_KEY = 'user';

  /**
   * Login user and store access token
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // withCredentials is set globally in api.ts
    // Backend will set refresh_token cookie and return access_token in response
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    
    // Store access token in localStorage
    if (response.data.data.access_token) {
      this.setAccessToken(response.data.data.access_token);
    }
    
    return response.data;
  }

  /**
   * Refresh access token using refresh token cookie
   */
  async refresh(): Promise<RefreshTokenResponse> {
    // withCredentials will send refresh_token cookie
    const response = await api.post<RefreshTokenResponse>('/auth/refresh');
    
    // Store new access token
    if (response.data.data.access_token) {
      this.setAccessToken(response.data.data.access_token);
    }
    
    return response.data;
  }

  /**
   * Logout from current device
   */
  async logout(): Promise<void> {
    try {
      // Backend will clear refresh_token cookie
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all local data
      this.clearAuthData();
    }
  }

  /**
   * Logout from all devices
   */
  async logoutAll(): Promise<void> {
    try {
      await api.post('/auth/logout-all');
    } catch (error) {
      console.error('Logout all error:', error);
    } finally {
      // Clear all local data
      this.clearAuthData();
    }
  }

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Store access token
   */
  setAccessToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  /**
   * Remove access token
   */
  removeAccessToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Check if user is authenticated by checking if access token exists
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Clear all authentication data
   */
  clearAuthData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Get stored user data
   */
  getUserData(): any | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem(this.USER_KEY);
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Store user data
   */
  setUserData(user: any): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }
}

export default new AuthService();