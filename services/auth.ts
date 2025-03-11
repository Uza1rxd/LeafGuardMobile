import AsyncStorage from '@react-native-async-storage/async-storage';
import { LeafGuardApi } from './LeafGuardApi';
import axios from 'axios';
import { DEFAULT_USER } from '../constants/DefaultUser';
import NetInfo from '@react-native-community/netinfo';

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
export const OFFLINE_CREDENTIALS_KEY = 'offlineCredentials';

interface OfflineCredentials {
  email: string;
  password: string;
}

export const auth = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // First check network connectivity
      const netInfo = await NetInfo.fetch();
      const isConnected = netInfo.isConnected;

      if (__DEV__) {
        console.log('Network status:', {
          isConnected,
          type: netInfo.type,
          details: netInfo.details,
        });
      }

      // First check if these are the default credentials
      if (email === DEFAULT_USER.email && password === 'password') {
        if (__DEV__) {
          console.log('Using default credentials');
        }
        await this.handleAuthResponse(DEFAULT_USER as Required<AuthResponse>);
        return DEFAULT_USER;
      }

      // Try to get stored credentials
      const storedCredentials = await this.getOfflineCredentials();
      const storedUser = await this.getStoredUser();

      if (__DEV__) {
        console.log('Stored credentials check:', {
          hasStoredCredentials: !!storedCredentials,
          hasStoredUser: !!storedUser,
          matchesEmail: storedCredentials?.email === email,
        });
      }

      // If credentials match stored ones and we have stored user data
      if (storedCredentials?.email === email && 
          storedCredentials?.password === password && 
          storedUser) {
        if (__DEV__) {
          console.log('Using stored credentials');
        }
        return { ...storedUser, token: 'offline_token' };
      }

      // If we're offline and no stored credentials match, we can't proceed
      if (!isConnected) {
        throw new Error('No internet connection - Please use default credentials or try again when online');
      }

      // If we reach here, try online login
      try {
        if (__DEV__) {
          console.log('Attempting online login');
        }

        const response = await LeafGuardApi.login({ email, password });
        
        if (!response.token) {
          throw new Error('No token received from server');
        }
        
        // Save credentials for future offline use
        await this.saveOfflineCredentials(email, password);
        await this.handleAuthResponse(response as Required<AuthResponse>);

        if (__DEV__) {
          console.log('Online login successful');
        }

        return response;
      } catch (error) {
        if (__DEV__) {
          console.error('Online login error:', error);
        }

        // If it's a network error and we have stored credentials, use them
        if (axios.isAxiosError(error) && !error.response) {
          throw new Error('Server connection failed - Please check your connection or use default credentials');
        }
        
        // For other errors, throw appropriate error messages
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            throw new Error('Invalid email or password');
          } else if (error.response?.status === 404) {
            throw new Error('Account not found');
          }
        }
        throw new Error('Login failed - Please try again');
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Login process error:', error);
      }
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  },

  async saveOfflineCredentials(email: string, password: string): Promise<void> {
    try {
      const credentials: OfflineCredentials = { email, password };
      await AsyncStorage.setItem(OFFLINE_CREDENTIALS_KEY, JSON.stringify(credentials));
    } catch (error) {
      console.error('Error saving offline credentials:', error);
    }
  },

  async getOfflineCredentials(): Promise<OfflineCredentials | null> {
    try {
      const credentials = await AsyncStorage.getItem(OFFLINE_CREDENTIALS_KEY);
      return credentials ? JSON.parse(credentials) : null;
    } catch (error) {
      console.error('Error getting offline credentials:', error);
      return null;
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