import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Theme } from '../../constants/Theme';
import { Card, TouchableCard } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { LeafGuardApi } from '../../services/LeafGuardApi';

interface RecentScan {
  id: string;
  date: Date;
  plantName: string;
  disease: string;
  confidence: number;
  imageUri: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const [weatherData, setWeatherData] = useState({
    temperature: '24°C',
    humidity: '65%',
    condition: 'Partly Cloudy',
  });

  useEffect(() => {
    // Update the API URL to the latest one
    LeafGuardApi.updateBaseUrl('https://5c2f-206-84-168-78.ngrok-free.app/api/predict/');
    checkApiStatus();
    loadMockData();
  }, []);

  const checkApiStatus = async () => {
    setApiStatus('checking');
    try {
      const response = await LeafGuardApi.healthCheck();
      setApiStatus(response.data ? 'online' : 'offline');
    } catch (error) {
      console.error('API status check failed:', error);
      setApiStatus('offline');
    }
  };

  const loadMockData = () => {
    // Mock data for recent scans
    const mockScans: RecentScan[] = [
      {
        id: '1',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        plantName: 'Tomato',
        disease: 'Early Blight',
        confidence: 0.92,
        imageUri: 'https://www.planetnatural.com/wp-content/uploads/2012/12/tomato-early-blight.jpg',
      },
      {
        id: '2',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        plantName: 'Apple',
        disease: 'Apple Scab',
        confidence: 0.87,
        imageUri: 'https://extension.umn.edu/sites/extension.umn.edu/files/styles/large/public/apple-scab-fruit.jpg',
      },
    ];
    
    setRecentScans(mockScans);
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      checkApiStatus(),
      loadMockData()
    ]);
    setIsRefreshing(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const navigateToDetection = () => {
    router.push('/(tabs)/disease-detection');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: '#2C3D32' }]}>
              Hello, {user?.name || 'User'}
            </Text>
            <Text style={[styles.subGreeting, { color: '#445C4B' }]}>
              Welcome to LeafGuard
            </Text>
          </View>
          <View style={[styles.apiStatusContainer, { backgroundColor: apiStatus === 'online' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)' }]}>
            <View style={[styles.apiStatusDot, { backgroundColor: apiStatus === 'online' ? Theme.colors.success : Theme.colors.error }]} />
            <Text style={[styles.apiStatusText, { color: apiStatus === 'online' ? Theme.colors.success : Theme.colors.error }]}>
              {apiStatus === 'online' ? 'API Online' : 'API Offline'}
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={[styles.sectionTitle, { color: '#2C3D32' }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActions}>
            <TouchableCard
              style={styles.quickActionCard}
              onPress={navigateToDetection}
            >
              <Ionicons name="leaf" size={32} color={Theme.colors.primary} />
              <Text style={[styles.quickActionTitle, { color: '#2C3D32' }]}>
                Detect Disease
              </Text>
            </TouchableCard>
            <TouchableCard
              style={styles.quickActionCard}
              onPress={() => {}}
            >
              <Ionicons name="book" size={32} color={Theme.colors.primary} />
              <Text style={[styles.quickActionTitle, { color: '#2C3D32' }]}>
                Disease Library
              </Text>
            </TouchableCard>
            <TouchableCard
              style={styles.quickActionCard}
              onPress={() => {}}
            >
              <Ionicons name="map" size={32} color={Theme.colors.primary} />
              <Text style={[styles.quickActionTitle, { color: '#2C3D32' }]}>
                Disease Map
              </Text>
            </TouchableCard>
          </View>
        </View>

        {/* Weather Card */}
        <Card style={styles.weatherCard}>
          <View style={styles.weatherHeader}>
            <Text style={[styles.weatherTitle, { color: '#2C3D32' }]}>
              Current Weather
            </Text>
            <Ionicons name="partly-sunny" size={24} color={Theme.colors.primary} />
          </View>
          <View style={styles.weatherContent}>
            <View style={styles.weatherItem}>
              <Ionicons name="thermometer-outline" size={20} color={'#445C4B'} />
              <Text style={[styles.weatherText, { color: '#2C3D32' }]}>
                {weatherData.temperature}
              </Text>
            </View>
            <View style={styles.weatherItem}>
              <Ionicons name="water-outline" size={20} color={'#445C4B'} />
              <Text style={[styles.weatherText, { color: '#2C3D32' }]}>
                {weatherData.humidity}
              </Text>
            </View>
            <View style={styles.weatherItem}>
              <Ionicons name="cloud-outline" size={20} color={'#445C4B'} />
              <Text style={[styles.weatherText, { color: '#2C3D32' }]}>
                {weatherData.condition}
              </Text>
            </View>
          </View>
        </Card>

        {/* Subscription Status */}
        <Card style={styles.subscriptionCard}>
          <View style={styles.subscriptionContent}>
            <View>
              <Text style={[styles.subscriptionTitle, { color: '#2C3D32' }]}>
                {user?.isSubscribed ? 'Premium Plan' : 'Free Plan'}
              </Text>
              <Text style={[styles.subscriptionText, { color: '#445C4B' }]}>
                {user?.isSubscribed 
                  ? 'Unlimited scans available' 
                  : `${user?.remainingFreeScans || 0} free scans remaining`}
              </Text>
            </View>
            {!user?.isSubscribed && (
              <TouchableOpacity style={styles.upgradeButton}>
                <Text style={styles.upgradeButtonText}>Upgrade</Text>
              </TouchableOpacity>
            )}
          </View>
        </Card>

        {/* Recent Scans */}
        <View style={styles.recentScansContainer}>
          <Text style={[styles.sectionTitle, { color: '#2C3D32' }]}>
            Recent Scans
          </Text>
          {recentScans.length > 0 ? (
            recentScans.map((scan) => (
              <TouchableCard key={scan.id} style={styles.scanCard} onPress={() => {}}>
                <Image source={{ uri: scan.imageUri }} style={styles.scanImage} />
                <View style={styles.scanInfo}>
                  <Text style={[styles.scanPlant, { color: '#2C3D32' }]}>
                    {scan.plantName}
                  </Text>
                  <Text style={[styles.scanDisease, { color: Theme.colors.error }]}>
                    {scan.disease}
                  </Text>
                  <Text style={[styles.scanDate, { color: '#445C4B' }]}>
                    {formatDate(scan.date)}
                  </Text>
                </View>
                <View style={styles.scanConfidence}>
                  <Text style={[styles.confidenceText, { color: Theme.colors.primary }]}>
                    {Math.round(scan.confidence * 100)}%
                  </Text>
                  <Text style={[styles.confidenceLabel, { color: '#445C4B' }]}>
                    Confidence
                  </Text>
                </View>
              </TouchableCard>
            ))
          ) : (
            <Card style={styles.emptyScansCard}>
              <Ionicons name="leaf-outline" size={48} color={'#445C4B'} />
              <Text style={[styles.emptyScansText, { color: '#2C3D32' }]}>
                No recent scans
              </Text>
              <Text style={[styles.emptyScansSubtext, { color: '#445C4B' }]}>
                Start by scanning a plant leaf to detect diseases
              </Text>
              <TouchableOpacity style={styles.scanNowButton} onPress={navigateToDetection}>
                <Text style={styles.scanNowButtonText}>Scan Now</Text>
              </TouchableOpacity>
            </Card>
          )}
        </View>
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
  greeting: {
    fontSize: Theme.typography.fontSize.xl,
    fontWeight: 'bold',
  },
  subGreeting: {
    fontSize: Theme.typography.fontSize.md,
  },
  apiStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.round,
  },
  apiStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Theme.spacing.xs,
  },
  apiStatusText: {
    fontSize: Theme.typography.fontSize.sm,
    fontWeight: '500',
  },
  quickActionsContainer: {
    marginBottom: Theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: '600',
    marginBottom: Theme.spacing.sm,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: Theme.spacing.xs,
    paddingVertical: Theme.spacing.md,
  },
  quickActionTitle: {
    fontSize: Theme.typography.fontSize.sm,
    fontWeight: '500',
    marginTop: Theme.spacing.sm,
    textAlign: 'center',
  },
  weatherCard: {
    marginBottom: Theme.spacing.lg,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  weatherTitle: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
  },
  weatherContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weatherItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherText: {
    fontSize: Theme.typography.fontSize.md,
    marginLeft: Theme.spacing.xs,
  },
  subscriptionCard: {
    marginBottom: Theme.spacing.lg,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  subscriptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subscriptionTitle: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
    marginBottom: Theme.spacing.xs,
  },
  subscriptionText: {
    fontSize: Theme.typography.fontSize.sm,
  },
  upgradeButton: {
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.md,
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: Theme.typography.fontSize.sm,
    fontWeight: '600',
  },
  recentScansContainer: {
    marginBottom: Theme.spacing.lg,
  },
  scanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  scanImage: {
    width: 60,
    height: 60,
    borderRadius: Theme.borderRadius.sm,
  },
  scanInfo: {
    flex: 1,
    marginLeft: Theme.spacing.md,
  },
  scanPlant: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
    marginBottom: Theme.spacing.xs,
  },
  scanDisease: {
    fontSize: Theme.typography.fontSize.sm,
    fontWeight: '500',
    marginBottom: Theme.spacing.xs,
  },
  scanDate: {
    fontSize: Theme.typography.fontSize.xs,
  },
  scanConfidence: {
    alignItems: 'center',
  },
  confidenceText: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: 'bold',
  },
  confidenceLabel: {
    fontSize: Theme.typography.fontSize.xs,
  },
  emptyScansCard: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.xl,
  },
  emptyScansText: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: '600',
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.xs,
  },
  emptyScansSubtext: {
    fontSize: Theme.typography.fontSize.sm,
    textAlign: 'center',
    marginBottom: Theme.spacing.lg,
  },
  scanNowButton: {
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
  },
  scanNowButtonText: {
    color: '#FFFFFF',
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
  },
});