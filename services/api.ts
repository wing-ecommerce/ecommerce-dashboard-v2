import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // CRITICAL: This sends cookies (refresh token) automatically
});

// Request interceptor - Add Authorization header with access token
api.interceptors.request.use(
  (config) => {
    // Get access token from localStorage
    const token = localStorage.getItem('access_token');
    
    // Add Authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 Unauthorized and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('🔄 Access token expired, attempting refresh...');
        
        // Try to refresh the token
        // withCredentials will send the refresh_token cookie
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = response.data.data.access_token;
        
        if (newAccessToken) {
          console.log('✅ Token refreshed successfully');
          
          // Store new access token
          localStorage.setItem('access_token', newAccessToken);
          
          // Update the failed request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        
        // Refresh failed - clear auth data and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        
        // Only redirect if not already on login page
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth/login')) {
          window.location.href = '/auth/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;