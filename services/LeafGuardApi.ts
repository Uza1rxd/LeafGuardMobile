import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isSubscribed: boolean;
  remainingFreeScans: number;
  token?: string;
}

interface DiseaseDetection {
  disease: string;
  confidence: number;
  description: string;
  symptoms: string[];
  recommendations: string[];
  preventions: string[];
  imageUrl: string;
  remainingScans: number;
  error?: string;
}

interface SavedScan extends DiseaseDetection {
  _id: string;
  userId: string;
  createdAt: string;
  plantName: string;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

class LeafGuardApiService {
  private api: AxiosInstance;
  private static instance: LeafGuardApiService;

  private constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.HEADERS,
    });

    // Add request interceptor to check network and attach auth token
    this.api.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        try {
          // Check network connectivity
          const netInfo = await NetInfo.fetch();
          
          if (__DEV__) {
            console.log('API Request Details:', {
              fullUrl: `${config.baseURL}${config.url}`,
              method: config.method,
              headers: config.headers,
              data: config.data,
              networkInfo: {
                isConnected: netInfo.isConnected,
                type: netInfo.type,
                isInternetReachable: netInfo.isInternetReachable,
                details: netInfo.details,
              },
            });
          }

          if (!netInfo.isConnected) {
            throw new Error('No internet connection available');
          }

          if (!netInfo.isInternetReachable) {
            throw new Error('Internet is not reachable');
          }

          // Attach auth token
          const token = await AsyncStorage.getItem('userToken');
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }

          return config;
        } catch (error) {
          if (__DEV__) {
            console.error('API Request Error:', error);
          }
          return Promise.reject(error);
        }
      },
      (error: unknown) => {
        if (__DEV__) {
          console.error('API Request Interceptor Error:', error);
        }
        return Promise.reject(error);
      }
    );

    // Add response interceptor with retry logic
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        if (__DEV__) {
          console.log('API Response Success:', {
            url: response.config.url,
            status: response.status,
            data: response.data,
          });
        }
        return response;
      },
      async (error: unknown) => {
        if (__DEV__) {
          console.error('API Response Error Details:', {
            error: error,
            isAxiosError: axios.isAxiosError(error),
            config: axios.isAxiosError(error) ? {
              url: error.config?.url,
              baseURL: error.config?.baseURL,
              method: error.config?.method,
              timeout: error.config?.timeout,
            } : null,
            response: axios.isAxiosError(error) ? error.response : null,
            message: axios.isAxiosError(error) ? error.message : 'Unknown error',
          });
        }

        if (axios.isAxiosError(error)) {
          const config = error.config as any;
          
          // Only retry on network errors or 5xx server errors
          if ((!error.response || error.response.status >= 500) && (!config._retry || config._retry < API_CONFIG.MAX_RETRIES)) {
            config._retry = (config._retry || 0) + 1;
            
            if (__DEV__) {
              console.log(`Retrying request (attempt ${config._retry}/${API_CONFIG.MAX_RETRIES})`);
            }

            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
            
            return this.api(config);
          }

          // Check network connectivity
          const netInfo = await NetInfo.fetch();
          if (!netInfo.isConnected) {
            throw new Error('No internet connection available');
          }

          if (!error.response) {
            throw new Error('Network error - Unable to connect to server. Please check if the server is running and try again.');
          } else if (error.response.status === 401) {
            await AsyncStorage.removeItem('userToken');
            throw new Error('Session expired - Please log in again');
          } else if (error.response.status === 404) {
            throw new Error('Resource not found - Please check the API endpoint');
          } else if (error.response.status >= 500) {
            throw new Error('Server error - Please try again later');
          }
        }
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): LeafGuardApiService {
    if (!LeafGuardApiService.instance) {
      LeafGuardApiService.instance = new LeafGuardApiService();
    }
    return LeafGuardApiService.instance;
  }

  public getBaseUrl(): string {
    return this.api.defaults.baseURL || '';
  }

  public async predictDisease(imageUri: string): Promise<DiseaseDetection> {
    return this.detectDisease(imageUri);
  }

  public updateBaseUrl(newBaseUrl: string): void {
    if (__DEV__) {
      console.log('Updating API base URL:', newBaseUrl);
    }
    this.api.defaults.baseURL = newBaseUrl;
  }

  public resetBaseUrl(): void {
    if (__DEV__) {
      console.log('Resetting API base URL to default:', API_CONFIG.BASE_URL);
    }
    this.api.defaults.baseURL = API_CONFIG.BASE_URL;
  }

  public async healthCheck(): Promise<AxiosResponse> {
    return this.api.get('/health');
  }

  // Auth endpoints
  async register(userData: { name: string; email: string; password: string; role?: string }): Promise<User> {
    const response = await this.api.post<User>('/auth/register', userData);
    return response.data;
  }

  async login(credentials: { email: string; password: string }): Promise<User> {
    try {
      if (__DEV__) {
        console.log('Attempting login with:', {
          email: credentials.email,
          baseURL: this.api.defaults.baseURL,
        });
      }

      const response = await this.api.post<User>('/auth/login', credentials);
      
      if (__DEV__) {
        console.log('Login response:', response.data);
      }

      return response.data;
    } catch (error) {
      if (__DEV__) {
        console.error('Login error:', error);
      }

      if (axios.isAxiosError(error)) {
        // Handle specific error cases
        if (error.response?.status === 401) {
          const errorMessage = error.response.data?.message || '';
          if (errorMessage.toLowerCase().includes('password')) {
            throw new Error('Incorrect password');
          } else if (errorMessage.toLowerCase().includes('email')) {
            throw new Error('Email not found');
          } else {
            throw new Error('Invalid credentials');
          }
        } else if (!error.response) {
          throw new Error('Network error - Unable to connect to server');
        } else if (error.response.status === 404) {
          throw new Error('Email not found');
        } else if (error.response.status >= 500) {
          throw new Error('Server error - Please try again later');
        }
      }
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    await this.api.post('/auth/forgot-password', { email });
  }

  // Plant disease detection
  async detectDisease(imageUri: string): Promise<DiseaseDetection> {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'plant.jpg',
    } as any);

    const response = await this.api.post<DiseaseDetection>('/plants/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async saveScan(scanData: Omit<SavedScan, '_id' | 'userId' | 'createdAt'>): Promise<SavedScan> {
    const response = await this.api.post<SavedScan>('/plants/scans', scanData);
    return response.data;
  }

  async getRecentScans(): Promise<SavedScan[]> {
    const response = await this.api.get<{ data: SavedScan[] }>('/plants/scans');
    return response.data.data;
  }

  // Subscription management
  async getSubscriptionPlans(): Promise<{ data: SubscriptionPlan[] }> {
    const response = await this.api.get<{ data: SubscriptionPlan[] }>('/subscriptions/plans');
    return response.data;
  }

  async subscribeToPlan(planId: string, paymentId: string): Promise<{ data: { subscription: any; user: User } }> {
    const response = await this.api.post('/subscriptions/subscribe', { planId, paymentId });
    return response.data;
  }

  async getSubscriptionStatus(): Promise<{ data: { isSubscribed: boolean; remainingFreeScans: number; subscription: any } }> {
    const response = await this.api.get('/subscriptions/status');
    return response.data;
  }

  async cancelSubscription(): Promise<{ success: boolean; message: string; data: { isSubscribed: boolean; remainingFreeScans: number } }> {
    const response = await this.api.post('/subscriptions/cancel');
    return response.data;
  }

  // User profile and scans
  async getUserProfile(): Promise<User> {
    const response = await this.api.get<User>('/users');
    return response.data;
  }

  async updateUserProfile(userData: { name?: string; email?: string; password?: string }): Promise<User> {
    const response = await this.api.put<User>('/users', userData);
    return response.data;
  }

  async getUserScans(): Promise<{ success: boolean; count: number; data: SavedScan[] }> {
    const response = await this.api.get('/users/scans');
    return response.data;
  }
}

// Export a singleton instance
export const LeafGuardApi = LeafGuardApiService.getInstance(); 