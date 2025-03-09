import React from 'react';
import {
  View,
  StyleSheet,
  ViewProps,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { Theme } from '../../constants/Theme';

interface CardProps extends ViewProps {
  style?: ViewStyle;
  variant?: 'elevated' | 'outlined' | 'filled';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'elevated',
  ...rest
}) => {
  const getCardStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: Theme.borderRadius.md,
      padding: Theme.spacing.lg,
      marginVertical: Theme.spacing.sm,
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          backgroundColor: Theme.colors.card.light,
          ...Theme.shadows.light.md,
        };
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: Theme.colors.border.light,
        };
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
        };
      default:
        return baseStyle;
    }
  };

  return (
    <View style={[getCardStyles(), style]} {...rest}>
      {children}
    </View>
  );
};

interface TouchableCardProps extends TouchableOpacityProps {
  style?: ViewStyle;
  variant?: 'elevated' | 'outlined' | 'filled';
}

export const TouchableCard: React.FC<TouchableCardProps> = ({
  children,
  style,
  variant = 'elevated',
  ...rest
}) => {
  const getCardStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: Theme.borderRadius.md,
      padding: Theme.spacing.lg,
      marginVertical: Theme.spacing.sm,
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          backgroundColor: Theme.colors.card.light,
          ...Theme.shadows.light.md,
        };
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: Theme.colors.border.light,
        };
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
        };
      default:
        return baseStyle;
    }
  };

  return (
    <TouchableOpacity 
      style={[getCardStyles(), style]} 
      activeOpacity={0.7}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  );
}; 