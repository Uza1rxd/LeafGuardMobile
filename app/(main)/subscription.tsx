import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { Theme } from '../../constants/Theme';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';

// Define subscription plan type
interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
}

// Mock subscription plans
const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    billingCycle: 'monthly',
    features: [
      '5 disease scans per month',
      'Basic treatment recommendations',
      'Limited disease history',
    ],
  },
  {
    id: 'premium-monthly',
    name: 'Premium',
    price: 4.99,
    billingCycle: 'monthly',
    features: [
      'Unlimited disease scans',
      'Detailed treatment recommendations',
      'Full disease history',
      'Environmental data analysis',
      'Priority support',
    ],
    popular: true,
  },
  {
    id: 'premium-yearly',
    name: 'Premium Yearly',
    price: 49.99,
    billingCycle: 'yearly',
    features: [
      'Unlimited disease scans',
      'Detailed treatment recommendations',
      'Full disease history',
      'Environmental data analysis',
      'Priority support',
      'Save 16% compared to monthly',
    ],
  },
];

// Mock payment methods
const paymentMethods = [
  { id: 'card', name: 'Credit Card', icon: 'card-outline' },
  { id: 'paypal', name: 'PayPal', icon: 'logo-paypal' },
  { id: 'apple', name: 'Apple Pay', icon: 'logo-apple' },
  { id: 'google', name: 'Google Pay', icon: 'logo-google' },
];

// Mock billing history
const billingHistory = [
  { id: '1', date: '2023-05-01', amount: 4.99, status: 'Paid' },
  { id: '2', date: '2023-04-01', amount: 4.99, status: 'Paid' },
  { id: '3', date: '2023-03-01', amount: 4.99, status: 'Paid' },
];

export default function SubscriptionScreen() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selectedPlan, setSelectedPlan] = useState<string>(user?.isSubscribed ? 'premium-monthly' : 'free');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('card');

  const handleSubscribe = () => {
    if (selectedPlan === 'free') {
      Alert.alert('Downgrade to Free', 'Are you sure you want to downgrade to the free plan?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => console.log('Downgraded to free plan') },
      ]);
    } else {
      Alert.alert('Subscribe', `You've selected the ${selectedPlan} plan. This would open a payment flow.`);
    }
  };

  const handleAddPaymentMethod = () => {
    Alert.alert('Add Payment Method', 'This would open a form to add a new payment method.');
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
            Subscription
          </Text>
        </View>

        {/* Current Plan */}
        <Card style={styles.currentPlanCard}>
          <Text style={[styles.currentPlanTitle, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
            Current Plan
          </Text>
          <View style={styles.currentPlanDetails}>
            <View>
              <Text style={[styles.planName, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
                {user?.isSubscribed ? 'Premium' : 'Free'}
              </Text>
              <Text style={[styles.planDescription, { color: isDark ? Theme.colors.text.secondary.dark : Theme.colors.text.secondary.light }]}>
                {user?.isSubscribed 
                  ? 'Unlimited scans, priority support' 
                  : `${user?.remainingFreeScans || 0} free scans remaining`}
              </Text>
            </View>
            {user?.isSubscribed && (
              <View style={[styles.activeBadge, { backgroundColor: Theme.colors.statusBackground.success }]}>
                <Text style={[styles.activeBadgeText, { color: Theme.colors.success }]}>
                  Active
                </Text>
              </View>
            )}
          </View>
          {!user?.isSubscribed && (
            <Button
              title="Upgrade Now"
              style={styles.upgradeButton}
              onPress={() => setSelectedPlan('premium-monthly')}
            />
          )}
        </Card>

        {/* Subscription Plans */}
        <Text style={[styles.sectionTitle, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
          Choose a Plan
        </Text>
        
        {subscriptionPlans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planCard,
              selectedPlan === plan.id && { borderColor: Theme.colors.primary, borderWidth: 2 },
              plan.popular && { borderColor: Theme.colors.secondary, borderWidth: plan.id === selectedPlan ? 2 : 1 },
            ]}
            onPress={() => setSelectedPlan(plan.id)}
          >
            {plan.popular && (
              <View style={[styles.popularBadge, { backgroundColor: Theme.colors.secondary }]}>
                <Text style={styles.popularBadgeText}>Popular</Text>
              </View>
            )}
            <View style={styles.planHeader}>
              <View>
                <Text style={[styles.planCardName, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
                  {plan.name}
                </Text>
                <Text style={[styles.planCardCycle, { color: isDark ? Theme.colors.text.secondary.dark : Theme.colors.text.secondary.light }]}>
                  {plan.billingCycle === 'yearly' ? 'Billed annually' : 'Billed monthly'}
                </Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={[styles.currency, { color: isDark ? Theme.colors.text.secondary.dark : Theme.colors.text.secondary.light }]}>
                  $
                </Text>
                <Text style={[styles.price, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
                  {plan.price.toFixed(2)}
                </Text>
                <Text style={[styles.pricePeriod, { color: isDark ? Theme.colors.text.secondary.dark : Theme.colors.text.secondary.light }]}>
                  /{plan.billingCycle === 'yearly' ? 'year' : 'mo'}
                </Text>
              </View>
            </View>
            
            <View style={styles.featuresContainer}>
              {plan.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color={Theme.colors.primary} />
                  <Text style={[styles.featureText, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
            
            <View style={styles.planSelection}>
              <View style={[
                styles.radioButton, 
                selectedPlan === plan.id && { borderColor: Theme.colors.primary }
              ]}>
                {selectedPlan === plan.id && (
                  <View style={[styles.radioButtonInner, { backgroundColor: Theme.colors.primary }]} />
                )}
              </View>
              <Text style={[styles.selectPlanText, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
                {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Payment Methods */}
        {selectedPlan !== 'free' && (
          <>
            <Text style={[styles.sectionTitle, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
              Payment Method
            </Text>
            
            <Card style={styles.paymentMethodsCard}>
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentMethodItem,
                    selectedPaymentMethod === method.id && { backgroundColor: 'rgba(117, 154, 128, 0.1)' },
                  ]}
                  onPress={() => setSelectedPaymentMethod(method.id)}
                >
                  <View style={styles.paymentMethodInfo}>
                    <Ionicons name={method.icon as keyof typeof Ionicons.glyphMap} size={24} color={Theme.colors.primary} />
                    <Text style={[styles.paymentMethodName, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
                      {method.name}
                    </Text>
                  </View>
                  <View style={[
                    styles.radioButton, 
                    selectedPaymentMethod === method.id && { borderColor: Theme.colors.primary }
                  ]}>
                    {selectedPaymentMethod === method.id && (
                      <View style={[styles.radioButtonInner, { backgroundColor: Theme.colors.primary }]} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity
                style={styles.addPaymentMethod}
                onPress={handleAddPaymentMethod}
              >
                <Ionicons name="add-circle-outline" size={20} color={Theme.colors.primary} />
                <Text style={[styles.addPaymentMethodText, { color: Theme.colors.primary }]}>
                  Add Payment Method
                </Text>
              </TouchableOpacity>
            </Card>
          </>
        )}

        {/* Billing History */}
        {user?.isSubscribed && (
          <>
            <Text style={[styles.sectionTitle, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
              Billing History
            </Text>
            
            <Card style={styles.billingHistoryCard}>
              {billingHistory.map((bill, index) => (
                <View 
                  key={bill.id} 
                  style={[
                    styles.billItem,
                    index < billingHistory.length - 1 && styles.billItemBorder,
                  ]}
                >
                  <View>
                    <Text style={[styles.billDate, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
                      {bill.date}
                    </Text>
                    <Text style={[styles.billStatus, { color: Theme.colors.success }]}>
                      {bill.status}
                    </Text>
                  </View>
                  <Text style={[styles.billAmount, { color: isDark ? Theme.colors.text.primary.dark : Theme.colors.text.primary.light }]}>
                    ${bill.amount.toFixed(2)}
                  </Text>
                </View>
              ))}
            </Card>
          </>
        )}

        {/* Subscribe Button */}
        <Button
          title={selectedPlan === 'free' ? 'Downgrade to Free' : 'Subscribe Now'}
          style={styles.subscribeButton}
          onPress={handleSubscribe}
        />
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
  currentPlanCard: {
    marginBottom: Theme.spacing.lg,
  },
  currentPlanTitle: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
    marginBottom: Theme.spacing.md,
  },
  currentPlanDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  planName: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: Theme.spacing.xxs,
  },
  planDescription: {
    fontSize: Theme.typography.fontSize.sm,
  },
  activeBadge: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xxs,
    borderRadius: Theme.borderRadius.round,
  },
  activeBadgeText: {
    fontSize: Theme.typography.fontSize.xs,
    fontWeight: '600',
  },
  upgradeButton: {
    marginTop: Theme.spacing.sm,
  },
  planCard: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: Theme.spacing.lg,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xxs,
    borderRadius: Theme.borderRadius.round,
  },
  popularBadgeText: {
    fontSize: Theme.typography.fontSize.xs,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.md,
  },
  planCardName: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: Theme.spacing.xxs,
  },
  planCardCycle: {
    fontSize: Theme.typography.fontSize.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  currency: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
    marginTop: 4,
  },
  price: {
    fontSize: Theme.typography.fontSize.xxl,
    fontWeight: 'bold',
  },
  pricePeriod: {
    fontSize: Theme.typography.fontSize.sm,
    marginTop: 6,
  },
  featuresContainer: {
    marginBottom: Theme.spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  featureText: {
    fontSize: Theme.typography.fontSize.sm,
    marginLeft: Theme.spacing.xs,
  },
  planSelection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.xs,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  selectPlanText: {
    fontSize: Theme.typography.fontSize.sm,
    fontWeight: '500',
  },
  paymentMethodsCard: {
    marginBottom: Theme.spacing.lg,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodName: {
    fontSize: Theme.typography.fontSize.md,
    marginLeft: Theme.spacing.md,
  },
  addPaymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.md,
    marginTop: Theme.spacing.sm,
  },
  addPaymentMethodText: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '500',
    marginLeft: Theme.spacing.xs,
  },
  billingHistoryCard: {
    marginBottom: Theme.spacing.lg,
  },
  billItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
  },
  billItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  billDate: {
    fontSize: Theme.typography.fontSize.md,
    marginBottom: Theme.spacing.xxs,
  },
  billStatus: {
    fontSize: Theme.typography.fontSize.xs,
    fontWeight: '500',
  },
  billAmount: {
    fontSize: Theme.typography.fontSize.md,
    fontWeight: '600',
  },
  subscribeButton: {
    marginTop: Theme.spacing.lg,
  },
}); 