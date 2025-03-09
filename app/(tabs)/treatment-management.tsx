import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Theme } from '../../constants/Theme';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

// Define treatment type
interface Treatment {
  id: string;
  disease: string;
  plant: string;
  method: string;
  isOrganic: boolean;
  status: 'Pending' | 'Completed' | 'Overdue';
  dueDate: Date;
  reminderSet: boolean;
  notes?: string;
}

// Mock data for treatments
const mockTreatments: Treatment[] = [
  {
    id: '1',
    disease: 'Early Blight',
    plant: 'Tomato',
    method: 'Apply copper-based fungicide',
    isOrganic: false,
    status: 'Pending',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    reminderSet: true,
    notes: 'Apply in the morning when dry',
  },
  {
    id: '2',
    disease: 'Powdery Mildew',
    plant: 'Cucumber',
    method: 'Spray with neem oil solution',
    isOrganic: true,
    status: 'Pending',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    reminderSet: false,
  },
  {
    id: '3',
    disease: 'Aphid Infestation',
    plant: 'Rose',
    method: 'Apply insecticidal soap',
    isOrganic: true,
    status: 'Completed',
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    reminderSet: false,
    notes: 'Reapply after rain',
  },
  {
    id: '4',
    disease: 'Late Blight',
    plant: 'Potato',
    method: 'Apply chlorothalonil fungicide',
    isOrganic: false,
    status: 'Overdue',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    reminderSet: true,
  },
];

// Status colors
const statusColors = {
  'Pending': Theme.colors.info,
  'Completed': Theme.colors.success,
  'Overdue': Theme.colors.error,
};

export default function TreatmentManagementScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [treatments, setTreatments] = useState<Treatment[]>(mockTreatments);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const filterOptions = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'completed', label: 'Completed' },
    { id: 'overdue', label: 'Overdue' },
  ];

  const filteredTreatments = treatments.filter(treatment => {
    if (selectedFilter === 'all') return true;
    return treatment.status.toLowerCase() === selectedFilter;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleToggleReminder = (id: string) => {
    setTreatments(prevTreatments => 
      prevTreatments.map(treatment => 
        treatment.id === id 
          ? { ...treatment, reminderSet: !treatment.reminderSet } 
          : treatment
      )
    );
  };

  const handleMarkAsCompleted = (id: string) => {
    setTreatments(prevTreatments => 
      prevTreatments.map(treatment => 
        treatment.id === id 
          ? { ...treatment, status: 'Completed' } 
          : treatment
      )
    );
  };

  const handleChangeDueDate = (id: string) => {
    const treatment = treatments.find(t => t.id === id);
    if (treatment) {
      setSelectedTreatment(treatment);
      setSelectedDate(treatment.dueDate);
      setShowDatePicker(true);
    }
  };

  const onDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    
    if (date && selectedTreatment) {
      setTreatments(prevTreatments => 
        prevTreatments.map(treatment => 
          treatment.id === selectedTreatment.id 
            ? { ...treatment, dueDate: date } 
            : treatment
        )
      );
    }
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
            Treatment Management
          </Text>
        </View>

        {/* Filter Options */}
        <View style={styles.filterContainer}>
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

        {/* Treatment Cards */}
        {filteredTreatments.length > 0 ? (
          filteredTreatments.map((treatment) => (
            <Card key={treatment.id} style={styles.treatmentCard}>
              <View style={styles.treatmentHeader}>
                <View style={styles.treatmentInfo}>
                  <Text style={[styles.diseaseName, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
                    {treatment.disease}
                  </Text>
                  <Text style={[styles.plantName, { color: isDark ? Theme.colors.text.secondary.dark : Theme.colors.text.secondary.light }]}>
                    {treatment.plant}
                  </Text>
                </View>
                <View style={[
                  styles.statusBadge, 
                  { backgroundColor: statusColors[treatment.status] + '20' }
                ]}>
                  <Text style={[styles.statusText, { color: statusColors[treatment.status] }]}>
                    {treatment.status}
                  </Text>
                </View>
              </View>
              
              <View style={styles.treatmentMethod}>
                <Text style={[styles.methodLabel, { color: isDark ? Theme.colors.text.secondary.dark : Theme.colors.text.secondary.light }]}>
                  Treatment Method:
                </Text>
                <Text style={[styles.methodText, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
                  {treatment.method}
                </Text>
                {treatment.isOrganic && (
                  <View style={styles.organicBadge}>
                    <Ionicons name="leaf" size={12} color={Theme.colors.success} />
                    <Text style={[styles.organicText, { color: Theme.colors.success }]}>
                      Organic
                    </Text>
                  </View>
                )}
              </View>
              
              <View style={styles.treatmentDetails}>
                <TouchableOpacity 
                  style={styles.dueDateContainer}
                  onPress={() => handleChangeDueDate(treatment.id)}
                >
                  <Ionicons name="calendar-outline" size={16} color={Theme.colors.primary} />
                  <Text style={[styles.dueDateText, { color: isDark ? Theme.colors.text.secondary.dark : Theme.colors.text.secondary.light }]}>
                    Due: {formatDate(treatment.dueDate)}
                  </Text>
                </TouchableOpacity>
                
                <View style={styles.reminderContainer}>
                  <Text style={[styles.reminderText, { color: isDark ? Theme.colors.text.secondary.dark : Theme.colors.text.secondary.light }]}>
                    Reminder
                  </Text>
                  <Switch
                    value={treatment.reminderSet}
                    onValueChange={() => handleToggleReminder(treatment.id)}
                    trackColor={{ false: '#767577', true: Theme.colors.primaryLight }}
                    thumbColor={treatment.reminderSet ? Theme.colors.primary : '#f4f3f4'}
                  />
                </View>
              </View>
              
              {treatment.notes && (
                <View style={styles.notesContainer}>
                  <Text style={[styles.notesLabel, { color: isDark ? Theme.colors.text.secondary.dark : Theme.colors.text.secondary.light }]}>
                    Notes:
                  </Text>
                  <Text style={[styles.notesText, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
                    {treatment.notes}
                  </Text>
                </View>
              )}
              
              {treatment.status !== 'Completed' && (
                <Button
                  title="Mark as Completed"
                  variant="outline"
                  size="small"
                  onPress={() => handleMarkAsCompleted(treatment.id)}
                  style={styles.completeButton}
                />
              )}
            </Card>
          ))
        ) : (
          <Card style={styles.emptyStateCard}>
            <Ionicons name="checkmark-circle-outline" size={48} color={isDark ? Theme.colors.text.disabled.dark : Theme.colors.text.disabled.light} />
            <Text style={[styles.emptyStateTitle, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
              No treatments found
            </Text>
            <Text style={[styles.emptyStateText, { color: isDark ? Theme.colors.text.secondary.dark : Theme.colors.text.secondary.light }]}>
              {selectedFilter === 'all' 
                ? 'You have no treatments scheduled' 
                : `You have no ${selectedFilter} treatments`}
            </Text>
          </Card>
        )}

        {/* Add Treatment Button */}
        <Button
          title="Add New Treatment"
          leftIcon={<Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />}
          style={styles.addButton}
          onPress={() => Alert.alert('Add Treatment', 'This would open a form to add a new treatment.')}
        />

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
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
    marginBottom: Theme.spacing.lg,
  },
  title: {
    fontSize: Theme.typography.fontSize.xxl,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.lg,
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
  treatmentCard: {
    marginBottom: Theme.spacing.md,
  },
  treatmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.sm,
  },
  treatmentInfo: {
    flex: 1,
  },
  diseaseName: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
    marginBottom: Theme.spacing.xxs,
  },
  plantName: {
    fontSize: Theme.typography.fontSize.sm,
  },
  statusBadge: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xxs,
    borderRadius: Theme.borderRadius.round,
  },
  statusText: {
    fontSize: Theme.typography.fontSize.xs,
    fontWeight: '600',
  },
  treatmentMethod: {
    marginBottom: Theme.spacing.md,
  },
  methodLabel: {
    fontSize: Theme.typography.fontSize.sm,
    marginBottom: Theme.spacing.xxs,
  },
  methodText: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '500',
  },
  organicBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Theme.spacing.xs,
  },
  organicText: {
    fontSize: Theme.typography.fontSize.xs,
    fontWeight: '600',
    marginLeft: Theme.spacing.xxs,
  },
  treatmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDateText: {
    fontSize: Theme.typography.fontSize.sm,
    marginLeft: Theme.spacing.xs,
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderText: {
    fontSize: Theme.typography.fontSize.sm,
    marginRight: Theme.spacing.xs,
  },
  notesContainer: {
    marginBottom: Theme.spacing.md,
  },
  notesLabel: {
    fontSize: Theme.typography.fontSize.sm,
    marginBottom: Theme.spacing.xxs,
  },
  notesText: {
    fontSize: Theme.typography.fontSize.sm,
  },
  completeButton: {
    alignSelf: 'flex-end',
  },
  emptyStateCard: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.xl,
  },
  emptyStateTitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: '600',
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.xs,
  },
  emptyStateText: {
    fontSize: Theme.typography.fontSize.md,
    textAlign: 'center',
  },
  addButton: {
    marginTop: Theme.spacing.lg,
  },
}); 