import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

    // Add request interceptor to attach auth token
    this.api.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await AsyncStorage.getItem('userToken');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: unknown) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: unknown) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          // Handle unauthorized access (e.g., clear token and redirect to login)
          await AsyncStorage.removeItem('userToken');
          // You might want to trigger a navigation to login screen here
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
    this.api.defaults.baseURL = newBaseUrl;
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
    const response = await this.api.post<User>('/auth/login', credentials);
    return response.data;
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