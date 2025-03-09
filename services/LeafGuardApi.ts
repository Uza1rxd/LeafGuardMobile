import { Platform } from 'react-native';

// Base URL for the LeafGuard API
let API_BASE_URL = 'https://5c2f-206-84-168-78.ngrok-free.app/api';

interface DiseaseDetectionResponse {
  disease: string;
  confidence: number;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

/**
 * Service for interacting with the LeafGuard API
 */
export const LeafGuardApi = {
  /**
   * Check if the API is running
   */
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`API health check failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API health check error:', error);
      return { 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  },

  /**
   * Predict plant disease from an image
   * @param imageUri - The URI of the image to analyze
   */
  async predictDisease(imageUri: string): Promise<ApiResponse<DiseaseDetectionResponse>> {
    try {
      // Create form data with the image
      const formData = new FormData();
      
      // Prepare the image object based on the platform
      const filename = imageUri.split('/').pop() || 'image.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      // @ts-ignore - FormData expects a Blob but React Native uses objects
      formData.append('image', {
        uri: Platform.OS === 'android' ? imageUri : imageUri.replace('file://', ''),
        name: filename,
        type,
      });

      console.log('Making API request to:', `${API_BASE_URL}/predict/`);
      
      // Make the API request to the predict endpoint
      const response = await fetch(`${API_BASE_URL}/predict/`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API request failed with status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      return { data };
    } catch (error) {
      console.error('Disease prediction error:', error);
      return { 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  },

  /**
   * Get the current base URL for the API
   */
  getBaseUrl(): string {
    return API_BASE_URL;
  },

  /**
   * Update the base URL for the API
   * @param newUrl - The new base URL for the API
   */
  updateBaseUrl(newUrl: string): void {
    if (newUrl) {
      // Remove trailing slash if present
      API_BASE_URL = newUrl.endsWith('/') ? newUrl.slice(0, -1) : newUrl;
      console.log(`API base URL updated to: ${API_BASE_URL}`);
    }
  },
}; 