import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { Theme } from '../../constants/Theme';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';

// Mock data for environmental conditions
const mockWeatherData = {
  current: {
    temperature: 24,
    humidity: 65,
    windSpeed: 12,
    precipitation: 0,
    condition: 'Partly Cloudy',
    icon: 'partly-sunny',
  },
  forecast: [
    { day: 'Mon', temperature: 24, condition: 'partly-sunny' },
    { day: 'Tue', temperature: 26, condition: 'sunny' },
    { day: 'Wed', temperature: 23, condition: 'rainy' },
    { day: 'Thu', temperature: 22, condition: 'cloudy' },
    { day: 'Fri', temperature: 25, condition: 'sunny' },
  ],
  historical: {
    temperature: [22, 23, 24, 25, 24, 23, 24],
    humidity: [60, 65, 70, 68, 65, 63, 65],
    precipitation: [0, 5, 10, 2, 0, 0, 0],
    dates: ['6 days ago', '5 days ago', '4 days ago', '3 days ago', '2 days ago', 'Yesterday', 'Today'],
  },
  diseaseRisk: {
    level: 'Medium',
    factors: [
      'Moderate humidity levels',
      'Warm temperatures',
      'Recent precipitation',
    ],
    recommendations: [
      'Monitor plants for early signs of disease',
      'Consider preventative fungicide application',
      'Ensure good air circulation around plants',
    ],
  },
};

// Weather condition icons mapping
const weatherIcons = {
  'sunny': 'sunny',
  'partly-sunny': 'partly-sunny',
  'cloudy': 'cloudy',
  'rainy': 'rainy',
  'thunderstorm': 'thunderstorm',
};

// Risk level colors
const riskColors = {
  'Low': Theme.colors.success,
  'Medium': Theme.colors.warning,
  'High': Theme.colors.error,
};

// Custom Bar Chart Component
interface SimpleBarChartProps {
  data: number[];
  labels: string[];
  height?: number;
  barColor?: string;
  maxValue?: number | null;
  yAxisSuffix?: string;
  isDark?: boolean;
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ 
  data, 
  labels, 
  height = 180, 
  barColor = Theme.colors.primary,
  maxValue = null,
  yAxisSuffix = '',
  isDark = false 
}) => {
  // Calculate the maximum value for scaling
  const max = maxValue !== null ? maxValue : Math.max(...data) * 1.2;
  
  return (
    <View style={styles.simpleChartContainer}>
      <View style={styles.yAxisLabels}>
        <Text style={[styles.axisLabel, { color: isDark ? '#FFFFFF' : '#2C3D32' }]}>
          {max}{yAxisSuffix}
        </Text>
        <Text style={[styles.axisLabel, { color: isDark ? '#FFFFFF' : '#2C3D32' }]}>
          {Math.round(max/2)}{yAxisSuffix}
        </Text>
        <Text style={[styles.axisLabel, { color: isDark ? '#FFFFFF' : '#2C3D32' }]}>
          0{yAxisSuffix}
        </Text>
      </View>
      
      <View style={styles.chartContent}>
        <View style={styles.horizontalGridLines}>
          <View style={styles.gridLine} />
          <View style={styles.gridLine} />
          <View style={styles.gridLine} />
        </View>
        
        <View style={styles.barsContainer}>
          {data.map((value: number, index: number) => (
            <View key={index} style={styles.barColumn}>
              <View style={[
                styles.bar, 
                { 
                  height: `${(value / max) * 100}%`,
                  backgroundColor: barColor
                }
              ]} />
              <Text style={[styles.barLabel, { color: isDark ? '#FFFFFF' : '#2C3D32' }]}>
                {labels[index]}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default function EnvironmentalDataScreen() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [weatherData, setWeatherData] = useState(mockWeatherData);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  const screenWidth = Dimensions.get('window').width - (Theme.spacing.lg * 2);

  const onRefresh = async () => {
    setIsRefreshing(true);
    // In a real app, you would fetch updated data here
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Theme.colors.background.dark : Theme.colors.background.light }]} edges={['top']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: '#2C3D32' }]}>
            Environmental Data
          </Text>
        </View>

        {/* Current Weather Card */}
        <Card style={styles.currentWeatherCard}>
          <View style={styles.currentWeatherHeader}>
            <View>
              <Text style={[styles.currentWeatherTitle, { color: '#2C3D32' }]}>
                Current Weather
              </Text>
              <Text style={[styles.currentWeatherLocation, { color: '#445C4B' }]}>
                Your Location
              </Text>
            </View>
            <Ionicons 
              name={weatherData.current.icon as keyof typeof Ionicons.glyphMap} 
              size={48} 
              color={Theme.colors.primary} 
            />
          </View>
          
          <View style={styles.currentWeatherDetails}>
            <View style={styles.temperatureContainer}>
              <Text style={[styles.temperatureValue, { color: '#2C3D32' }]}>
                {weatherData.current.temperature}°C
              </Text>
              <Text style={[styles.weatherCondition, { color: '#445C4B' }]}>
                {weatherData.current.condition}
              </Text>
            </View>
            
            <View style={styles.weatherMetrics}>
              <View style={styles.metricItem}>
                <Ionicons name="water-outline" size={20} color={Theme.colors.info} />
                <Text style={[styles.metricValue, { color: '#2C3D32' }]}>
                  {weatherData.current.humidity}%
                </Text>
                <Text style={[styles.metricLabel, { color: '#445C4B' }]}>
                  Humidity
                </Text>
              </View>
              
              <View style={styles.metricItem}>
                <Ionicons name="speedometer-outline" size={20} color={Theme.colors.secondary} />
                <Text style={[styles.metricValue, { color: '#2C3D32' }]}>
                  {weatherData.current.windSpeed} km/h
                </Text>
                <Text style={[styles.metricLabel, { color: '#445C4B' }]}>
                  Wind
                </Text>
              </View>
              
              <View style={styles.metricItem}>
                <Ionicons name="rainy-outline" size={20} color={Theme.colors.primary} />
                <Text style={[styles.metricValue, { color: '#2C3D32' }]}>
                  {weatherData.current.precipitation} mm
                </Text>
                <Text style={[styles.metricLabel, { color: '#445C4B' }]}>
                  Rain
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* 5-Day Forecast */}
        <Card style={styles.forecastCard}>
          <Text style={[styles.sectionTitle, { color: '#2C3D32' }]}>
            5-Day Forecast
          </Text>
          
          <View style={styles.forecastContainer}>
            {weatherData.forecast.map((day, index) => (
              <View key={index} style={styles.forecastDay}>
                <Text style={[styles.forecastDayName, { color: '#2C3D32' }]}>
                  {day.day}
                </Text>
                <Ionicons 
                  name={day.condition as keyof typeof Ionicons.glyphMap} 
                  size={24} 
                  color={Theme.colors.primary} 
                />
                <Text style={[styles.forecastTemperature, { color: '#2C3D32' }]}>
                  {day.temperature}°C
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Historical Data Charts */}
        <Card style={styles.chartsCard}>
          <View style={styles.chartHeader}>
            <Text style={[styles.sectionTitle, { color: '#2C3D32' }]}>
              Historical Data
            </Text>
            
            <View style={styles.timeframeSelector}>
              <TouchableOpacity 
                style={[
                  styles.timeframeButton, 
                  selectedTimeframe === 'week' && { backgroundColor: Theme.colors.primaryLight }
                ]}
                onPress={() => setSelectedTimeframe('week')}
              >
                <Text style={[
                  styles.timeframeText,
                  selectedTimeframe === 'week' && { color: '#2C3D32', fontWeight: '600' }
                ]}>
                  Week
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.timeframeButton, 
                  selectedTimeframe === 'month' && { backgroundColor: Theme.colors.primaryLight }
                ]}
                onPress={() => setSelectedTimeframe('month')}
              >
                <Text style={[
                  styles.timeframeText,
                  selectedTimeframe === 'month' && { color: '#2C3D32', fontWeight: '600' }
                ]}>
                  Month
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.timeframeButton, 
                  selectedTimeframe === 'year' && { backgroundColor: Theme.colors.primaryLight }
                ]}
                onPress={() => setSelectedTimeframe('year')}
              >
                <Text style={[
                  styles.timeframeText,
                  selectedTimeframe === 'year' && { color: '#2C3D32', fontWeight: '600' }
                ]}>
                  Year
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.chartContainer}>
            <Text style={[styles.chartTitle, { color: '#2C3D32' }]}>
              Temperature
            </Text>
            <SimpleBarChart 
              data={weatherData.historical.temperature}
              labels={weatherData.historical.dates}
              barColor="#FF9800"
              yAxisSuffix="°C"
              isDark={isDark}
            />
          </View>
          
          <View style={styles.chartContainer}>
            <Text style={[styles.chartTitle, { color: '#2C3D32' }]}>
              Humidity
            </Text>
            <SimpleBarChart 
              data={weatherData.historical.humidity}
              labels={weatherData.historical.dates}
              barColor="#2196F3"
              yAxisSuffix="%"
              isDark={isDark}
            />
          </View>
          
          <View style={styles.chartContainer}>
            <Text style={[styles.chartTitle, { color: '#2C3D32' }]}>
              Precipitation
            </Text>
            <SimpleBarChart 
              data={weatherData.historical.precipitation}
              labels={weatherData.historical.dates}
              barColor="#4CAF50"
              yAxisSuffix="mm"
              maxValue={15}
              isDark={isDark}
            />
          </View>
        </Card>

        {/* Disease Risk Assessment */}
        <Card style={styles.riskCard}>
          <Text style={[styles.sectionTitle, { color: '#2C3D32' }]}>
            Disease Risk Assessment
          </Text>
          
          <View style={styles.riskLevelContainer}>
            <View style={[
              styles.riskLevelBadge, 
              { backgroundColor: riskColors[weatherData.diseaseRisk.level as keyof typeof riskColors] + '20' }
            ]}>
              <Text style={[
                styles.riskLevelText, 
                { color: riskColors[weatherData.diseaseRisk.level as keyof typeof riskColors] }
              ]}>
                {weatherData.diseaseRisk.level} Risk
              </Text>
            </View>
          </View>
          
          <View style={styles.riskSection}>
            <Text style={[styles.riskSectionTitle, { color: '#2C3D32' }]}>
              Risk Factors
            </Text>
            {weatherData.diseaseRisk.factors.map((factor, index) => (
              <View key={index} style={styles.riskItem}>
                <Ionicons name="alert-circle-outline" size={20} color={Theme.colors.warning} />
                <Text style={[
                  styles.riskItemText, 
                  { color: '#2C3D32' }
                ]}>
                  {factor}
                </Text>
              </View>
            ))}
          </View>
          
          <View style={styles.riskSection}>
            <Text style={[styles.riskSectionTitle, { color: '#2C3D32' }]}>
              Recommendations
            </Text>
            {weatherData.diseaseRisk.recommendations.map((recommendation, index) => (
              <View key={index} style={styles.riskItem}>
                <Ionicons name="checkmark-circle-outline" size={20} color={Theme.colors.success} />
                <Text style={[
                  styles.riskItemText, 
                  { color: '#2C3D32' }
                ]}>
                  {recommendation}
                </Text>
              </View>
            ))}
          </View>
        </Card>
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
    marginBottom: Theme.spacing.lg,
  },
  title: {
    fontSize: Theme.typography.fontSize.xxl,
    fontWeight: 'bold',
  },
  currentWeatherCard: {
    marginBottom: Theme.spacing.lg,
  },
  currentWeatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  currentWeatherTitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: '600',
  },
  currentWeatherLocation: {
    fontSize: Theme.typography.fontSize.sm,
    marginTop: Theme.spacing.xxs,
  },
  currentWeatherDetails: {
    marginTop: Theme.spacing.sm,
  },
  temperatureContainer: {
    marginBottom: Theme.spacing.md,
  },
  temperatureValue: {
    fontSize: Theme.typography.fontSize.xxxl,
    fontWeight: 'bold',
  },
  weatherCondition: {
    fontSize: Theme.typography.fontSize.md,
  },
  weatherMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
    marginTop: Theme.spacing.xs,
  },
  metricLabel: {
    fontSize: Theme.typography.fontSize.sm,
    marginTop: Theme.spacing.xxs,
  },
  forecastCard: {
    marginBottom: Theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: '600',
    marginBottom: Theme.spacing.md,
  },
  forecastContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forecastDay: {
    alignItems: 'center',
    flex: 1,
  },
  forecastDayName: {
    fontSize: Theme.typography.fontSize.sm,
    marginBottom: Theme.spacing.xs,
  },
  forecastTemperature: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
    marginTop: Theme.spacing.xs,
  },
  chartsCard: {
    marginBottom: Theme.spacing.lg,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  timeframeSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: Theme.borderRadius.round,
    padding: Theme.spacing.xxs,
  },
  timeframeButton: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.round,
  },
  timeframeText: {
    fontSize: Theme.typography.fontSize.sm,
    color: '#445C4B',
  },
  chartContainer: {
    marginBottom: Theme.spacing.lg,
  },
  chartTitle: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
    marginBottom: Theme.spacing.sm,
  },
  simpleChartContainer: {
    height: 180,
    flexDirection: 'row',
    marginTop: Theme.spacing.md,
  },
  yAxisLabels: {
    width: 40,
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: Theme.spacing.xs,
    paddingVertical: Theme.spacing.xs,
  },
  axisLabel: {
    fontSize: 10,
    color: '#445C4B',
  },
  chartContent: {
    flex: 1,
    height: '100%',
    position: 'relative',
  },
  horizontalGridLines: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    paddingVertical: Theme.spacing.xs,
  },
  gridLine: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingBottom: 20, // Space for labels
  },
  barColumn: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 2,
  },
  bar: {
    width: '80%',
    minHeight: 4,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barLabel: {
    fontSize: 8,
    marginTop: 4,
    textAlign: 'center',
  },
  riskCard: {
    marginBottom: Theme.spacing.lg,
  },
  riskLevelContainer: {
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  riskLevelBadge: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.round,
  },
  riskLevelText: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
  },
  riskSection: {
    marginBottom: Theme.spacing.md,
  },
  riskSectionTitle: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
    marginBottom: Theme.spacing.sm,
  },
  riskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  riskItemText: {
    fontSize: Theme.typography.fontSize.md,
    marginLeft: Theme.spacing.sm,
    flex: 1,
  },
}); 