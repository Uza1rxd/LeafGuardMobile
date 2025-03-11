import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Get the local IP address from Expo constants
const { manifest } = Constants;
const debuggerHost = manifest?.debuggerHost || manifest?.hostUri || '';
const localIp = debuggerHost?.split(':')[0] || '10.0.2.2';

// Helper to determine if we're running in an emulator
const isEmulator = Platform.select({
  android: localIp === '10.0.2.2' || localIp === 'localhost' || localIp === '127.0.0.1',
  ios: localIp === 'localhost' || localIp === '127.0.0.1',
  default: false,
});

// Development server configuration
const DEV_CONFIG = {
  android: {
    emulator: 'http://10.0.2.2:5000/api',
    device: 'http://localhost:5000/api', // Using localhost with port forwarding
  },
  ios: {
    emulator: 'http://localhost:5000/api',
    device: 'http://localhost:5000/api',
  },
};

// Production URLs
const PROD_CONFIG = {
  BASE_URL: 'https://your-production-api.com/api',
  PREDICT_URL: 'https://your-production-api.com/api/predict',
};

export const API_CONFIG = {
  // Use appropriate URL based on platform and environment
  BASE_URL: __DEV__
    ? Platform.select({
        android: DEV_CONFIG.android.device,
        ios: DEV_CONFIG.ios.device,
        default: 'http://localhost:5000/api',
      })
    : PROD_CONFIG.BASE_URL,
  TIMEOUT: 15000, // 15 seconds
  RETRY_DELAY: 1000, // 1 second
  MAX_RETRIES: 3,
  HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

if (__DEV__) {
  console.log('API Configuration:', {
    baseUrl: API_CONFIG.BASE_URL,
    platform: Platform.OS,
    usingUSB: true,
  });
} 