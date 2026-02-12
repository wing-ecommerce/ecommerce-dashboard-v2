"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/services/auth.service';

interface User {
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
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
}

interface LoginResult {
  success: boolean;
  message: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Check if user is authenticated by verifying token and user data
   */
  const checkAuth = useCallback(() => {
    try {
      const token = authService.getAccessToken();
      const savedUserData = authService.getUserData();
      
      if (token && savedUserData) {
        setUser(savedUserData);
        setIsAuthenticated(true);
      } else {
        // Clear any partial data
        authService.clearAuthData();
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      authService.clearAuthData();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Login user with username/email and password
   */
  const login = async (usernameOrEmail: string, password: string): Promise<LoginResult> => {
    try {
      const response = await authService.login({ usernameOrEmail, password });
      
      // Check if user has ADMIN role
      if (response.data.user.role !== 'ADMIN') {
        // Clear any stored data
        authService.clearAuthData();
        
        return {
          success: false,
          message: 'Access denied. Admin privileges required.',
        };
      }

      // Prepare user data
      const userData: User = {
        id: response.data.user.id,
        username: response.data.user.username,
        email: response.data.user.email,
        firstName: response.data.user.firstName,
        lastName: response.data.user.lastName,
        role: response.data.user.role,
        enabled: response.data.user.enabled,
        profileImageUrl: response.data.user.profileImageUrl,
        oauthProvider: response.data.user.oauthProvider,
        emailVerified: response.data.user.emailVerified,
        createdAt: response.data.user.createdAt,
        updatedAt: response.data.user.updatedAt,
        lastLogin: response.data.user.lastLogin,
      };
      
      // Store user data
      authService.setUserData(userData);
      
      // Update state
      setUser(userData);
      setIsAuthenticated(true);
      
      return { 
        success: true, 
        message: response.message || 'Login successful' 
      };
    } catch (error: any) {
      // Clear any partial data
      authService.clearAuthData();
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Login failed. Please try again.';
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  /**
   * Logout from current device
   */
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear state regardless of API call result
      setUser(null);
      setIsAuthenticated(false);
      
      // Redirect to login
      router.push('/auth/login');
    }
  };

  /**
   * Logout from all devices
   */
  const logoutAll = async () => {
    try {
      await authService.logoutAll();
    } catch (error) {
      console.error('Logout all error:', error);
    } finally {
      // Clear state regardless of API call result
      setUser(null);
      setIsAuthenticated(false);
      
      // Redirect to login
      router.push('/auth/login');
    }
  };

  /**
   * Refresh authentication check
   */
  const refreshAuth = useCallback(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    logoutAll,
    checkAuth: refreshAuth,
  };
};