import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from '@/hooks/use-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Types
export interface ApiResponse<T = any> {
  data: T;
  error?: string;
}

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  timeout: 10000, // 10 seconds
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const message = (error.response.data as any)?.error || error.message;

      switch (status) {
        case 401:
          // Clear auth data and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          toast({
            title: 'Access Denied',
            description: message,
            variant: 'destructive',
          });
          break;
        case 404:
          toast({
            title: 'Not Found',
            description: message,
            variant: 'destructive',
          });
          break;
        default:
          toast({
            title: 'Error',
            description: message,
            variant: 'destructive',
          });
      }
    } else if (error.request) {
      toast({
        title: 'Network Error',
        description: 'Unable to connect to the server',
        variant: 'destructive',
      });
    }
    return Promise.reject(error);
  }
);

// API wrapper functions
export const apiService = {
  async get<T>(url: string, params?: object): Promise<ApiResponse<T>> {
    try {
      const response = await api.get<T>(url, { params });
      return { data: response.data };
    } catch (error) {
      throw error;
    }
  },

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const config = data instanceof FormData ? {
        headers: { 'Content-Type': 'multipart/form-data' }
      } : {};
      const response = await api.post<T>(url, data, config);
      return { data: response.data };
    } catch (error) {
      throw error;
    }
  },

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const config = data instanceof FormData ? {
        headers: { 'Content-Type': 'multipart/form-data' }
      } : {};
      const response = await api.put<T>(url, data, config);
      return { data: response.data };
    } catch (error) {
      throw error;
    }
  },

  async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await api.patch<T>(url, data);
      return { data: response.data };
    } catch (error) {
      throw error;
    }
  },

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await api.delete<T>(url);
      return { data: response.data };
    } catch (error) {
      throw error;
    }
  }
};

