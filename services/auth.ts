import AsyncStorage from '@react-native-async-storage/async-storage';
import { LeafGuardApi } from './LeafGuardApi';
import axios from 'axios';

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  isSubscribed: boolean;
  remainingFreeScans: number;
  token?: string;
}

export const AUTH_TOKEN_KEY = 'userToken';
export const USER_DATA_KEY = 'userData';

export const auth = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await LeafGuardApi.login({ email, password });
      if (!response.token) {
        throw new Error('No token received from server');
      }
      await this.handleAuthResponse(response as Required<AuthResponse>);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Invalid email or password');
        } else if (error.response?.status === 404) {
          throw new Error('User not found');
        } else if (!error.response) {
          throw new Error('Network error. Please check your internet connection');
        } else {
          throw new Error(error.response.data?.message || 'Login failed. Please try again');
        }
      }
      throw error;
    }
  },

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await LeafGuardApi.register({ name, email, password });
      if (!response.token) {
        throw new Error('No token received from server');
      }
      await this.handleAuthResponse(response as Required<AuthResponse>);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          throw new Error('Email already exists. Please use a different email');
        } else if (error.response?.status === 400) {
          throw new Error(error.response.data?.message || 'Invalid registration data');
        } else if (!error.response) {
          throw new Error('Network error. Please check your internet connection');
        } else {
          throw new Error(error.response.data?.message || 'Registration failed. Please try again');
        }
      }
      throw error;
    }
  },

  async forgotPassword(email: string): Promise<void> {
    try {
      await LeafGuardApi.forgotPassword(email);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('Email not found');
        } else if (!error.response) {
          throw new Error('Network error. Please check your internet connection');
        } else {
          throw new Error(error.response.data?.message || 'Failed to process password reset request');
        }
      }
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Failed to logout. Please try again');
    }
  },

  async handleAuthResponse(response: Required<AuthResponse>): Promise<void> {
    try {
      const { token, ...userData } = response;
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving auth data:', error);
      throw new Error('Failed to save authentication data');
    }
  },

  async getStoredToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting stored token:', error);
      return null;
    }
  },

  async getStoredUser(): Promise<Omit<AuthResponse, 'token'> | null> {
    try {
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting stored user:', error);
      return null;
    }
  },
}; 