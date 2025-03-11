import Constants from 'expo-constants';

// Get the local IP address from Expo constants
const { manifest } = Constants;
const localIp = manifest?.debuggerHost?.split(':')[0] || '127.0.0.1';

export const API_CONFIG = {
  // Use local IP when in development, production URL otherwise
  BASE_URL: __DEV__ 
    ? `http://${localIp}:5000/api`
    : 'https://your-production-api.com/api',
  TIMEOUT: 10000, // 10 seconds
  HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
}; 