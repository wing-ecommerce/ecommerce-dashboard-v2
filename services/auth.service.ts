import api from './api';

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string; // We'll ignore this since it's in cookie
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
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // withCredentials is set globally in api.ts
    // Backend will set access_token and refresh_token cookies
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  }

  async refresh(): Promise<RefreshTokenResponse> {
    // withCredentials will send refresh_token cookie
    const response = await api.post<RefreshTokenResponse>('/auth/refresh');
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      // Backend will clear both cookies
      await api.post('/auth/logout');
    } finally {
      // Clear user data from localStorage
      localStorage.removeItem('user');
    }
  }

  async logoutAll(): Promise<void> {
    try {
      await api.post('/auth/logout-all');
    } finally {
      localStorage.removeItem('user');
    }
  }

  // Check if user is authenticated by checking if user data exists
  isAuthenticated(): boolean {
    const userData = localStorage.getItem('user');
    return !!userData;
  }
}

export default new AuthService();