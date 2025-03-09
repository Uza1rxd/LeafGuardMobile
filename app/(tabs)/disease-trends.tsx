import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { Theme } from '../../constants/Theme';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

// Define the report type
interface DiseaseReport {
  id: string;
  disease: string;
  location: string;
  date: string;
  severity: 'Low' | 'Medium' | 'High';
  crop: string;
  coordinates: { latitude: number; longitude: number };
}

// Mock data for disease reports
const mockDiseaseReports: DiseaseReport[] = [
  {
    id: '1',
    disease: 'Early Blight',
    location: 'Nairobi, Kenya',
    date: '2023-05-15',
    severity: 'High',
    crop: 'Tomato',
    coordinates: { latitude: -1.286389, longitude: 36.817223 },
  },
  {
    id: '2',
    disease: 'Powdery Mildew',
    location: 'Mombasa, Kenya',
    date: '2023-05-10',
    severity: 'Medium',
    crop: 'Cucumber',
    coordinates: { latitude: -4.043740, longitude: 39.658871 },
  },
  {
    id: '3',
    disease: 'Late Blight',
    location: 'Kisumu, Kenya',
    date: '2023-05-08',
    severity: 'High',
    crop: 'Potato',
    coordinates: { latitude: -0.102222, longitude: 34.761667 },
  },
  {
    id: '4',
    disease: 'Rust',
    location: 'Nakuru, Kenya',
    date: '2023-05-05',
    severity: 'Low',
    crop: 'Wheat',
    coordinates: { latitude: -0.303099, longitude: 36.080025 },
  },
  {
    id: '5',
    disease: 'Leaf Spot',
    location: 'Eldoret, Kenya',
    date: '2023-05-01',
    severity: 'Medium',
    crop: 'Maize',
    coordinates: { latitude: 0.520882, longitude: 35.269779 },
  },
];

// Mock data for disease trends
const mockDiseaseTrends = {
  mostCommon: [
    { disease: 'Early Blight', count: 45 },
    { disease: 'Powdery Mildew', count: 32 },
    { disease: 'Late Blight', count: 28 },
    { disease: 'Leaf Spot', count: 21 },
    { disease: 'Rust', count: 15 },
  ],
  recentOutbreaks: [
    { disease: 'Early Blight', location: 'Nairobi Region', date: '2023-05-15' },
    { disease: 'Powdery Mildew', location: 'Coastal Region', date: '2023-05-10' },
    { disease: 'Late Blight', location: 'Western Region', date: '2023-05-08' },
  ],
  seasonalTrends: {
    spring: ['Early Blight', 'Powdery Mildew'],
    summer: ['Leaf Spot', 'Rust'],
    fall: ['Late Blight', 'Downy Mildew'],
    winter: ['Root Rot', 'Botrytis'],
  },
};

// Severity colors
const severityColors = {
  'Low': Theme.colors.success,
  'Medium': Theme.colors.warning,
  'High': Theme.colors.error,
};

export default function DiseaseTrendsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<DiseaseReport | null>(null);

  const screenWidth = Dimensions.get('window').width - (Theme.spacing.lg * 2);

  const filterOptions = [
    { id: 'all', label: 'All Diseases' },
    { id: 'high', label: 'High Severity' },
    { id: 'recent', label: 'Recent Reports' },
  ];

  const filteredReports = mockDiseaseReports.filter(report => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'high') return report.severity === 'High';
    if (selectedFilter === 'recent') {
      const reportDate = new Date(report.date);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return reportDate >= oneWeekAgo;
    }
    return true;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Theme.colors.background.dark : Theme.colors.background.light }]} edges={['top']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
            Disease Trends
          </Text>
        </View>

        {/* Map Placeholder */}
        <Card style={styles.mapCard}>
          <View style={styles.mapPlaceholder}>
            <Text style={[styles.mapPlaceholderText, { color: isDark ? Theme.colors.text.secondary.dark : Theme.colors.text.secondary.light }]}>
              Interactive Map
            </Text>
            <Text style={[styles.mapPlaceholderSubtext, { color: isDark ? Theme.colors.text.secondary.dark : Theme.colors.text.secondary.light }]}>
              (Map integration would be implemented here)
            </Text>
          </View>
          
          <View style={styles.mapFilters}>
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.filterButton,
                  selectedFilter === option.id && { backgroundColor: Theme.colors.primaryLight }
                ]}
                onPress={() => setSelectedFilter(option.id)}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedFilter === option.id && { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light, fontWeight: '600' }
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Disease Reports */}
        <Text style={[styles.sectionTitle, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
          Recent Disease Reports
        </Text>
        
        {filteredReports.map((report) => (
          <Card key={report.id} style={styles.reportCard}>
            <View style={styles.reportHeader}>
              <View style={styles.reportInfo}>
                <Text style={[styles.diseaseName, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
                  {report.disease}
                </Text>
                <Text style={[styles.cropName, { color: isDark ? Theme.colors.text.secondary.dark : Theme.colors.text.secondary.light }]}>
                  {report.crop}
                </Text>
              </View>
              <View style={[
                styles.severityBadge, 
                { backgroundColor: severityColors[report.severity] + '20' }
              ]}>
                <Text style={[styles.severityText, { color: severityColors[report.severity] }]}>
                  {report.severity}
                </Text>
              </View>
            </View>
            
            <View style={styles.reportDetails}>
              <View style={styles.reportDetailItem}>
                <Ionicons name="location-outline" size={16} color={Theme.colors.primary} />
                <Text style={[styles.reportDetailText, { color: isDark ? Theme.colors.text.secondary.dark : Theme.colors.text.secondary.light }]}>
                  {report.location}
                </Text>
              </View>
              
              <View style={styles.reportDetailItem}>
                <Ionicons name="calendar-outline" size={16} color={Theme.colors.primary} />
                <Text style={[styles.reportDetailText, { color: isDark ? Theme.colors.text.secondary.dark : Theme.colors.text.secondary.light }]}>
                  {report.date}
                </Text>
              </View>
            </View>
            
            <Button
              title="View Details"
              variant="outline"
              size="small"
              onPress={() => setSelectedReport(report)}
              style={styles.viewDetailsButton}
            />
          </Card>
        ))}

        {/* Disease Trends Analysis */}
        <Card style={styles.trendsCard}>
          <Text style={[styles.cardTitle, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
            Disease Trends Analysis
          </Text>
          
          <View style={styles.trendSection}>
            <Text style={[styles.trendSectionTitle, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
              Most Common Diseases
            </Text>
            {mockDiseaseTrends.mostCommon.map((item, index) => (
              <View key={index} style={styles.trendItem}>
                <View style={styles.trendRank}>
                  <Text style={[styles.trendRankText, { color: Theme.colors.primary }]}>
                    {index + 1}
                  </Text>
                </View>
                <Text style={[styles.trendDiseaseName, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
                  {item.disease}
                </Text>
                <Text style={[styles.trendCount, { color: isDark ? Theme.colors.text.secondary.dark : Theme.colors.text.secondary.light }]}>
                  {item.count} reports
                </Text>
              </View>
            ))}
          </View>
          
          <View style={styles.trendSection}>
            <Text style={[styles.trendSectionTitle, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
              Recent Outbreaks
            </Text>
            {mockDiseaseTrends.recentOutbreaks.map((item, index) => (
              <View key={index} style={styles.outbreakItem}>
                <View style={styles.outbreakIcon}>
                  <Ionicons name="warning-outline" size={20} color={Theme.colors.warning} />
                </View>
                <View style={styles.outbreakInfo}>
                  <Text style={[styles.outbreakDisease, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
                    {item.disease}
                  </Text>
                  <Text style={[styles.outbreakDetails, { color: isDark ? Theme.colors.text.secondary.dark : Theme.colors.text.secondary.light }]}>
                    {item.location} • {item.date}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          
          <View style={styles.trendSection}>
            <Text style={[styles.trendSectionTitle, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
              Seasonal Disease Patterns
            </Text>
            <View style={styles.seasonalContainer}>
              {Object.entries(mockDiseaseTrends.seasonalTrends).map(([season, diseases], index) => (
                <View key={index} style={styles.seasonItem}>
                  <Text style={[styles.seasonName, { color: Theme.colors.primary }]}>
                    {season.charAt(0).toUpperCase() + season.slice(1)}
                  </Text>
                  {diseases.map((disease, i) => (
                    <Text key={i} style={[styles.seasonDisease, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
                      • {disease}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
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
  sectionTitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: '600',
    marginTop: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
  },
  mapCard: {
    marginBottom: Theme.spacing.lg,
    padding: Theme.spacing.md,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: Theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  mapPlaceholderText: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: '600',
  },
  mapPlaceholderSubtext: {
    fontSize: Theme.typography.fontSize.sm,
    marginTop: Theme.spacing.xs,
  },
  mapFilters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Theme.spacing.sm,
  },
  filterButton: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.round,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  filterButtonText: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.secondary.light,
  },
  reportCard: {
    marginBottom: Theme.spacing.md,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.sm,
  },
  reportInfo: {
    flex: 1,
  },
  diseaseName: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
    marginBottom: Theme.spacing.xxs,
  },
  cropName: {
    fontSize: Theme.typography.fontSize.sm,
  },
  severityBadge: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xxs,
    borderRadius: Theme.borderRadius.round,
  },
  severityText: {
    fontSize: Theme.typography.fontSize.xs,
    fontWeight: '600',
  },
  reportDetails: {
    marginBottom: Theme.spacing.md,
  },
  reportDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  reportDetailText: {
    fontSize: Theme.typography.fontSize.sm,
    marginLeft: Theme.spacing.xs,
  },
  viewDetailsButton: {
    alignSelf: 'flex-end',
  },
  trendsCard: {
    marginTop: Theme.spacing.lg,
    marginBottom: Theme.spacing.xxl,
  },
  cardTitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: '600',
    marginBottom: Theme.spacing.lg,
  },
  trendSection: {
    marginBottom: Theme.spacing.lg,
  },
  trendSectionTitle: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
    marginBottom: Theme.spacing.md,
  },
  trendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  trendRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(117, 154, 128, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.sm,
  },
  trendRankText: {
    fontSize: Theme.typography.fontSize.sm,
    fontWeight: '600',
  },
  trendDiseaseName: {
    flex: 1,
    fontSize: Theme.typography.fontSize.md,
  },
  trendCount: {
    fontSize: Theme.typography.fontSize.sm,
  },
  outbreakItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  outbreakIcon: {
    marginRight: Theme.spacing.sm,
  },
  outbreakInfo: {
    flex: 1,
  },
  outbreakDisease: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '500',
    marginBottom: Theme.spacing.xxs,
  },
  outbreakDetails: {
    fontSize: Theme.typography.fontSize.sm,
  },
  seasonalContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  seasonItem: {
    width: '48%',
    marginBottom: Theme.spacing.md,
  },
  seasonName: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
    marginBottom: Theme.spacing.xs,
  },
  seasonDisease: {
    fontSize: Theme.typography.fontSize.sm,
    marginBottom: Theme.spacing.xxs,
  },
}); 