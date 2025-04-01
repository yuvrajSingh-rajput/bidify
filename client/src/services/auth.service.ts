import { api } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface TeamDetails {
  name: string;
  logo: string;
  description: string;
  budget?: number;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  role?: 'admin' | 'team_owner';
  teamDetails?: TeamDetails;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const AuthService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try{
      console.log("credentials: ", credentials);
      const { data } = await api.post<AuthResponse>('/auth/login', credentials, {
        headers: { 'Content-Type': 'application/json' }
      });      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    }catch(error: any){
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const { data } = await api.post<AuthResponse>('/auth/register', userData);
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error.message);
      throw error;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      const { data } = await api.get<{ user: User }>('/auth/profile');
      localStorage.setItem('user', JSON.stringify(data.user));
      return data.user;
    } catch (error) {
      this.logout();
      return null;
    }
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};
