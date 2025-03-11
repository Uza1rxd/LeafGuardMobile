import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

import { Theme } from '../../../constants/Theme';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { LeafGuardApi } from '../../../services/LeafGuardApi';

interface DetectionResult {
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

interface SavedScan extends DetectionResult {
  _id: string;
  userId: string;
  createdAt: string;
  plantName: string;
}

export default function DiseaseDetectionScreen() {
  const { user, updateRemainingScans } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [recentScans, setRecentScans] = useState<SavedScan[]>([]);
  const [apiUrl, setApiUrl] = useState(LeafGuardApi.getBaseUrl());
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize the API URL when the component mounts
  useEffect(() => {
    // Update the API URL to the latest one
    // LeafGuardApi.updateBaseUrl('https://5c2f-206-84-168-78.ngrok-free.app/api');
    checkApiStatus();
    loadRecentScans();
  }, []);

  const checkApiStatus = async () => {
    try {
      const response = await LeafGuardApi.healthCheck();
      setApiStatus(response.data ? 'online' : 'offline');
    } catch (error) {
      setApiStatus('offline');
      console.error('API status check failed:', error);
    }
  };

  const loadRecentScans = async () => {
    try {
      const scans = await LeafGuardApi.getRecentScans();
      setRecentScans(scans);
    } catch (error) {
      console.error('Failed to load recent scans:', error);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadRecentScans();
    setIsRefreshing(false);
  };

  const pickImage = async () => {
    // Request permission to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant permission to access your photos to use this feature.'
      );
      return;
    }

    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
      setResult(null); // Clear previous results
      detectDisease(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    // Request permission to access the camera
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant permission to access your camera to use this feature.'
      );
      return;
    }

    // Launch the camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
      setResult(null); // Clear previous results
      detectDisease(result.assets[0].uri);
    }
  };

  const detectDisease = async (imageUri: string) => {
    setIsLoading(true);
    setResult(null);
    try {
      const detection = await LeafGuardApi.predictDisease(imageUri);
      setResult(detection);
      updateRemainingScans(detection.remainingScans);

      // Save the scan to the database
      if (!detection.error) {
        await LeafGuardApi.saveScan({
          ...detection,
          plantName: detection.disease.split(' ')[0], // Use first word of disease as plant name
        });
        await loadRecentScans(); // Reload recent scans
      }
    } catch (error) {
      let errorMessage = 'Failed to detect disease. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('insufficient_scans')) {
          errorMessage = 'You have no remaining scans. Please upgrade your subscription.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else {
          errorMessage = error.message;
        }
      }
      Alert.alert('Detection Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetDetection = () => {
    setSelectedImage(null);
    setResult(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderTreatmentRecommendations = () => {
    if (!result) return null;

    // Mock treatment recommendations based on the disease
    const treatments = {
      'Early Blight': [
        'Remove and destroy infected leaves',
        'Apply fungicide containing chlorothalonil or copper',
        'Ensure proper spacing between plants for air circulation',
        'Water at the base of plants to avoid wetting leaves',
      ],
      'Late Blight': [
        'Remove and destroy all infected plant material',
        'Apply fungicide containing mancozeb or chlorothalonil',
        'Avoid overhead watering',
        'Rotate crops in subsequent seasons',
      ],
      'Tomato Mosaic Virus': [
        'Remove and destroy infected plants',
        'Disinfect gardening tools after use',
        'Control aphids and other insects that spread the virus',
        'Plant resistant varieties in the future',
      ],
      'Apple Scab': [
        'Apply fungicide in early spring',
        'Remove fallen leaves to reduce fungal spores',
        'Prune trees to improve air circulation',
        'Plant resistant apple varieties',
      ],
      'Powdery Mildew': [
        'Apply fungicide containing sulfur or potassium bicarbonate',
        'Improve air circulation around plants',
        'Avoid overhead watering',
        'Remove and destroy infected plant parts',
      ],
    };

    // Default treatments if the specific disease isn't in our mock data
    const defaultTreatments = [
      'Consult with a local agricultural extension office',
      'Remove and destroy infected plant material',
      'Apply appropriate fungicide or pesticide',
      'Improve plant growing conditions',
    ];

    const diseaseTreatments = treatments[result.disease as keyof typeof treatments] || defaultTreatments;

    return (
      <Card style={styles.treatmentCard}>
        <Text style={[styles.treatmentTitle, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
          Treatment Recommendations
        </Text>
        {diseaseTreatments.map((treatment, index) => (
          <View key={index} style={styles.treatmentItem}>
            <Ionicons name="checkmark-circle" size={20} color={Theme.colors.primary} />
            <Text style={[styles.treatmentText, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
              {treatment}
            </Text>
          </View>
        ))}
      </Card>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Theme.colors.background.dark : Theme.colors.background.light }]} edges={['top']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
            Disease Detection
          </Text>
          {user && !user.isSubscribed && (
            <View style={[styles.scanCounter, { backgroundColor: Theme.colors.statusBackground.info }]}>
              <Text style={[styles.scanCounterText, { color: Theme.colors.info }]}>
                {user.remainingFreeScans} scans left
              </Text>
            </View>
          )}
        </View>

        <Card style={styles.imageCard}>
          {selectedImage ? (
            <View style={styles.selectedImageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
              <TouchableOpacity 
                style={[styles.resetButton, { backgroundColor: Theme.colors.statusBackground.error }]} 
                onPress={resetDetection}
              >
                <Ionicons name="close-circle" size={28} color={Theme.colors.error} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <Ionicons 
                name="leaf-outline" 
                size={80} 
                color={isDark ? Theme.colors.text.disabled.dark : Theme.colors.text.disabled.light} 
              />
              <Text style={[
                styles.placeholderText, 
                { color: isDark ? Theme.colors.text.secondary.dark : Theme.colors.text.secondary.light }
              ]}>
                Select or take a photo of a plant leaf to detect diseases
              </Text>
            </View>
          )}
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            title="Select Photo"
            variant="outline"
            leftIcon={<Ionicons name="images-outline" size={20} color={Theme.colors.primary} />}
            style={styles.actionButton}
            onPress={pickImage}
            disabled={isLoading}
          />
          <Button
            title="Take Photo"
            variant="outline"
            leftIcon={<Ionicons name="camera-outline" size={20} color={Theme.colors.primary} />}
            style={styles.actionButton}
            onPress={takePhoto}
            disabled={isLoading}
          />
        </View>

        <Button
          title="Detect Disease"
          leftIcon={<Ionicons name="search-outline" size={20} color="#FFFFFF" />}
          style={styles.detectButton}
          onPress={() => {}}
          disabled={!selectedImage || isLoading}
          isLoading={isLoading}
        />

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Theme.colors.primary} />
            <Text style={[
              styles.loadingText, 
              { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }
            ]}>
              Analyzing image...
            </Text>
          </View>
        )}

        {result && (
          <View style={styles.detectionResult}>
            <Text style={styles.diseaseTitle}>{result.disease}</Text>
            <Text style={styles.confidence}>
              Confidence: {(result.confidence * 100).toFixed(2)}%
            </Text>
            
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{result.description}</Text>
            
            <Text style={styles.sectionTitle}>Symptoms</Text>
            {result.symptoms.map((symptom, index) => (
              <Text key={index} style={styles.listItem}>• {symptom}</Text>
            ))}
            
            <Text style={styles.sectionTitle}>Recommendations</Text>
            {result.recommendations.map((recommendation, index) => (
              <Text key={index} style={styles.listItem}>• {recommendation}</Text>
            ))}
            
            <Text style={styles.sectionTitle}>Prevention</Text>
            {result.preventions.map((prevention, index) => (
              <Text key={index} style={styles.listItem}>• {prevention}</Text>
            ))}
            
            <TouchableOpacity style={styles.resetButton} onPress={resetDetection}>
              <Text style={styles.resetButtonText}>Scan Another Plant</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Recent Scans */}
        {!selectedImage && (
          <View style={styles.recentScansContainer}>
            <Text style={styles.sectionTitle}>Recent Scans</Text>
            {recentScans.map((scan) => (
              <Card key={scan._id} style={styles.scanCard}>
                <Image source={{ uri: scan.imageUrl }} style={styles.scanImage} />
                <View style={styles.scanInfo}>
                  <Text style={styles.scanPlant}>{scan.plantName}</Text>
                  <Text style={styles.scanDisease}>{scan.disease}</Text>
                  <Text style={styles.scanDate}>{formatDate(scan.createdAt)}</Text>
                </View>
                <View style={styles.scanConfidence}>
                  <Text style={styles.scanConfidenceText}>
                    {(scan.confidence * 100).toFixed(0)}%
                  </Text>
                  <Text style={styles.confidenceLabel}>Confidence</Text>
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    backgroundColor: Theme.colors.primary,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    gap: 16,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  detectionResult: {
    gap: 12,
  },
  diseaseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  confidence: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  listItem: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    marginBottom: 4,
    lineHeight: 24,
  },
  resetButton: {
    backgroundColor: Theme.colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  recentScansContainer: {
    marginTop: 32,
    gap: 12,
  },
  scanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
  },
  scanImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  scanInfo: {
    flex: 1,
    marginLeft: 12,
  },
  scanPlant: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.primary,
  },
  scanDisease: {
    fontSize: 14,
    color: Theme.colors.error,
    marginTop: 2,
  },
  scanDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  scanConfidence: {
    alignItems: 'center',
  },
  scanConfidenceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  confidenceLabel: {
    fontSize: 12,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  imageCard: {
    marginBottom: Theme.spacing.lg,
    padding: 0,
    overflow: 'hidden',
  },
  selectedImageContainer: {
    position: 'relative',
  },
  selectedImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  placeholderContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.lg,
  },
  placeholderText: {
    fontSize: Theme.typography.fontSize.md,
    textAlign: 'center',
    marginTop: Theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: Theme.spacing.xs,
  },
  detectButton: {
    marginBottom: Theme.spacing.xl,
  },
  scanCounter: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.round,
  },
  scanCounterText: {
    fontSize: Theme.typography.fontSize.sm,
    fontWeight: '500',
  },
  treatmentCard: {
    marginBottom: Theme.spacing.lg,
  },
  treatmentTitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: '600',
    marginBottom: Theme.spacing.md,
  },
  treatmentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.sm,
  },
  treatmentText: {
    fontSize: Theme.typography.fontSize.md,
    marginLeft: Theme.spacing.sm,
    flex: 1,
  },
}); 