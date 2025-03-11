import { AuthResponse } from '../services/auth';

export const DEFAULT_USER: AuthResponse = {
  _id: 'offline_user',
  name: 'Default User',
  email: 'user@leafguard.com',
  role: 'user',
  isSubscribed: false,
  remainingFreeScans: 3,
  token: 'offline_token'
}; 