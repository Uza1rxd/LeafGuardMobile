import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';

import { Theme } from '../../constants/Theme';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { weatherService, WeatherData } from '../../services/WeatherService';

export default function EnvironmentalDataScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      getCurrentLocation();
    }
  };

  const getCurrentLocation = async () => {
    try {
      setIsLoading(true);
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const weather = await weatherService.getWeatherByCoordinates(latitude, longitude);
      setWeatherData(weather);
      setUseCurrentLocation(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to get current location. Please enter a city manually.');
      setUseCurrentLocation(false);
    } finally {
      setIsLoading(false);
    }
  };

  const searchCity = async () => {
    if (!city.trim()) {
      Alert.alert('Error', 'Please enter a city name');
      return;
    }

    try {
      setIsLoading(true);
      const weather = await weatherService.getWeatherByCity(city.trim());
      setWeatherData(weather);
      setUseCurrentLocation(false);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to fetch weather data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Theme.colors.background.dark : Theme.colors.background.light }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
          Environmental Data
        </Text>

        <Card style={styles.searchCard}>
          <View style={styles.searchContainer}>
            <TextInput
              style={[styles.searchInput, { 
                color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light,
                borderColor: isDark ? Theme.colors.border.dark : Theme.colors.border.light,
              }]}
              placeholder="Enter city name"
              placeholderTextColor={isDark ? Theme.colors.text.disabled.dark : Theme.colors.text.disabled.light}
              value={city}
              onChangeText={setCity}
              onSubmitEditing={searchCity}
            />
            <TouchableOpacity style={styles.searchButton} onPress={searchCity}>
              <Ionicons name="search" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <Button
            title="Use Current Location"
            variant="outline"
            leftIcon={<Ionicons name="location" size={20} color={Theme.colors.primary} />}
            onPress={getCurrentLocation}
            style={styles.locationButton}
          />
        </Card>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Theme.colors.primary} />
            <Text style={[styles.loadingText, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
              Fetching weather data...
            </Text>
          </View>
        ) : weatherData ? (
          <View style={styles.weatherContainer}>
            <Card style={styles.mainWeatherCard}>
              <View style={styles.locationContainer}>
                <Ionicons 
                  name="location" 
                  size={24} 
                  color={isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light} 
                />
                <Text style={[styles.location, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
                  {weatherData.location}
                </Text>
              </View>

              <View style={styles.weatherMain}>
                <Image source={{ uri: weatherData.icon }} style={styles.weatherIcon} />
                <Text style={[styles.temperature, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
                  {Math.round(weatherData.temperature)}°C
                </Text>
                <Text style={[styles.description, { color: isDark ? Theme.colors.text.secondary.dark : Theme.colors.text.secondary.light }]}>
                  {weatherData.description}
                </Text>
              </View>

              <View style={styles.weatherDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="water" size={20} color={Theme.colors.primary} />
                  <Text style={[styles.detailText, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
                    Humidity: {weatherData.humidity}%
                  </Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Ionicons name="speedometer" size={20} color={Theme.colors.primary} />
                  <Text style={[styles.detailText, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
                    Pressure: {weatherData.pressure} hPa
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Ionicons name="thermometer" size={20} color={Theme.colors.primary} />
                  <Text style={[styles.detailText, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
                    Feels like: {Math.round(weatherData.feelsLike)}°C
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Ionicons name="speedometer-outline" size={20} color={Theme.colors.primary} />
                  <Text style={[styles.detailText, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
                    Wind: {weatherData.windSpeed} m/s
                  </Text>
                </View>
              </View>

              <View style={styles.sunTimes}>
                <View style={styles.sunTimeItem}>
                  <Ionicons name="sunny" size={24} color={Theme.colors.warning} />
                  <Text style={[styles.sunTimeText, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
                    Sunrise: {formatTime(weatherData.sunrise)}
                  </Text>
                </View>
                
                <View style={styles.sunTimeItem}>
                  <Ionicons name="moon" size={24} color={Theme.colors.info} />
                  <Text style={[styles.sunTimeText, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
                    Sunset: {formatTime(weatherData.sunset)}
                  </Text>
                </View>
              </View>
            </Card>

            <Card style={styles.recommendationsCard}>
              <Text style={[styles.recommendationsTitle, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
                Plant Care Recommendations
              </Text>
              
              <View style={styles.recommendation}>
                <Ionicons name="water" size={20} color={Theme.colors.primary} />
                <Text style={[styles.recommendationText, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
                  {weatherData.humidity < 40 ? 'Low humidity - Consider misting your plants' :
                   weatherData.humidity > 70 ? 'High humidity - Ensure good air circulation' :
                   'Optimal humidity for most plants'}
                </Text>
              </View>

              <View style={styles.recommendation}>
                <Ionicons name="thermometer" size={20} color={Theme.colors.primary} />
                <Text style={[styles.recommendationText, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
                  {weatherData.temperature < 10 ? 'Protect plants from cold temperatures' :
                   weatherData.temperature > 30 ? 'Provide shade and extra water' :
                   'Temperature is suitable for most plants'}
                </Text>
              </View>

              <View style={styles.recommendation}>
                <Ionicons name="sunny" size={20} color={Theme.colors.primary} />
                <Text style={[styles.recommendationText, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
                  {weatherData.description.includes('clear') ? 'Good day for photosynthesis' :
                   weatherData.description.includes('cloud') ? 'Reduced light - monitor plant growth' :
                   weatherData.description.includes('rain') ? 'Hold off on watering plants' :
                   'Monitor plant water needs'}
                </Text>
              </View>
            </Card>
          </View>
        ) : null}
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
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchCard: {
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    fontSize: 16,
  },
  searchButton: {
    width: 48,
    height: 48,
    backgroundColor: Theme.colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationButton: {
    marginTop: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  weatherContainer: {
    gap: 20,
  },
  mainWeatherCard: {
    padding: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  location: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8,
  },
  weatherMain: {
    alignItems: 'center',
    marginBottom: 20,
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  description: {
    fontSize: 18,
    textTransform: 'capitalize',
  },
  weatherDetails: {
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    marginLeft: 12,
  },
  sunTimes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border.light,
  },
  sunTimeItem: {
    alignItems: 'center',
  },
  sunTimeText: {
    fontSize: 14,
    marginTop: 4,
  },
  recommendationsCard: {
    padding: 20,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  recommendation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recommendationText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    lineHeight: 22,
  },
}); 