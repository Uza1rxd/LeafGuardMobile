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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

import { Theme } from '../../constants/Theme';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { LeafGuardApi } from '../../services/LeafGuardApi';

interface DetectionResult {
  disease: string;
  confidence: number;
  imageUri: string;  // Local image URI
  resultImageUri?: string;  // Result image from API if available
  timestamp: Date;
}

export default function DiseaseDetectionScreen() {
  const { user, updateRemainingScans } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [apiUrl, setApiUrl] = useState(LeafGuardApi.getBaseUrl());
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  // Initialize the API URL when the component mounts
  useEffect(() => {
    // Update the API URL to the latest one
    LeafGuardApi.updateBaseUrl('https://5c2f-206-84-168-78.ngrok-free.app/api');
    checkApiStatus();
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
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
      setResult(null); // Clear previous results
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
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
      setResult(null); // Clear previous results
    }
  };

  const detectDisease = async () => {
    if (!selectedImage) {
      Alert.alert('No Image Selected', 'Please select or take a photo first.');
      return;
    }

    if (user && !user.isSubscribed && user.remainingFreeScans <= 0) {
      Alert.alert(
        'No Scans Remaining',
        'You have used all your free scans. Please upgrade to continue using this feature.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => router.push('/subscription') },
        ]
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await LeafGuardApi.predictDisease(selectedImage);
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setResult({
          disease: response.data.disease,
          confidence: response.data.confidence,
          imageUri: selectedImage,
          timestamp: new Date(),
        });

        // Update remaining scans if user is on free plan
        if (user && !user.isSubscribed && typeof user.remainingFreeScans === 'number') {
          // Decrement the remaining scans count
          const newRemainingScans = user.remainingFreeScans - 1;
          // You should implement updateRemainingScans in your AuthContext
          // and pass it down through the context
          if (typeof updateRemainingScans === 'function') {
            updateRemainingScans(newRemainingScans);
          }
        }
      }
    } catch (error) {
      Alert.alert(
        'Detection Failed',
        error instanceof Error 
          ? error.message 
          : 'Failed to analyze the image. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetDetection = () => {
    setSelectedImage(null);
    setResult(null);
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
        contentContainerStyle={styles.scrollContent}
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
          onPress={detectDisease}
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
          <View style={styles.resultContainer}>
            <Card style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Text style={[
                  styles.resultTitle, 
                  { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }
                ]}>
                  Detection Result
                </Text>
                <View style={[styles.confidenceBadge, { 
                  backgroundColor: result.confidence > 0.7 
                    ? Theme.colors.statusBackground.success 
                    : result.confidence > 0.5 
                      ? Theme.colors.statusBackground.warning 
                      : Theme.colors.statusBackground.error
                }]}>
                  <Text style={[styles.confidenceText, { 
                    color: result.confidence > 0.7 
                      ? Theme.colors.success 
                      : result.confidence > 0.5 
                        ? Theme.colors.warning 
                        : Theme.colors.error
                  }]}>
                    {Math.round(result.confidence * 100)}% Confidence
                  </Text>
                </View>
              </View>
              
              <View style={styles.imagesContainer}>
                <View style={styles.imageWrapper}>
                  <Text style={[styles.imageLabel, { color: isDark ? Theme.colors.text.secondary.dark : Theme.colors.text.secondary.light }]}>
                    Original Image
                  </Text>
                  <Image source={{ uri: result.imageUri }} style={styles.resultImage} />
                </View>
                
                {result.resultImageUri && (
                  <View style={styles.imageWrapper}>
                    <Text style={[styles.imageLabel, { color: isDark ? Theme.colors.text.secondary.dark : Theme.colors.text.secondary.light }]}>
                      Analyzed Image
                    </Text>
                    <Image source={{ uri: result.resultImageUri }} style={styles.resultImage} />
                  </View>
                )}
              </View>

              <View style={styles.diseaseContainer}>
                <Ionicons 
                  name="alert-circle" 
                  size={24} 
                  color={Theme.colors.error} 
                  style={styles.diseaseIcon}
                />
                <Text style={[
                  styles.diseaseName, 
                  { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }
                ]}>
                  {result.disease}
                </Text>
              </View>
              
              <Text style={[
                styles.detectionTime, 
                { color: isDark ? Theme.colors.text.secondary.dark : Theme.colors.text.secondary.light }
              ]}>
                Detected on {result.timestamp.toLocaleDateString()} at {result.timestamp.toLocaleTimeString()}
              </Text>
            </Card>

            {renderTreatmentRecommendations()}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.md,
    paddingBottom: Theme.spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  title: {
    fontSize: Theme.typography.fontSize.xxl,
    fontWeight: 'bold',
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
  resetButton: {
    position: 'absolute',
    top: Theme.spacing.sm,
    right: Theme.spacing.sm,
    borderRadius: 20,
    padding: Theme.spacing.xxs,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.lg,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: Theme.spacing.xs,
  },
  detectButton: {
    marginBottom: Theme.spacing.xl,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: Theme.spacing.lg,
  },
  loadingText: {
    fontSize: Theme.typography.fontSize.md,
    marginTop: Theme.spacing.sm,
  },
  resultContainer: {
    marginBottom: Theme.spacing.lg,
  },
  resultCard: {
    marginBottom: Theme.spacing.lg,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  resultTitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: '600',
  },
  confidenceBadge: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.round,
  },
  confidenceText: {
    fontSize: Theme.typography.fontSize.sm,
    fontWeight: '500',
  },
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: Theme.spacing.md,
  },
  imageWrapper: {
    flex: 1,
    marginHorizontal: Theme.spacing.xs,
  },
  imageLabel: {
    fontSize: Theme.typography.fontSize.sm,
    marginBottom: Theme.spacing.xs,
    textAlign: 'center',
  },
  resultImage: {
    width: '100%',
    height: 150,
    borderRadius: Theme.borderRadius.sm,
    resizeMode: 'cover',
  },
  diseaseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  diseaseIcon: {
    marginRight: Theme.spacing.sm,
  },
  diseaseName: {
    fontSize: Theme.typography.fontSize.xl,
    fontWeight: 'bold',
  },
  detectionTime: {
    fontSize: Theme.typography.fontSize.sm,
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