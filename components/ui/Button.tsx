import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Theme } from '../../constants/Theme';
import { useColorScheme } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  disabled,
  ...rest
}) => {
  const colorScheme = useColorScheme() || 'light';
  const isDark = colorScheme === 'dark';

  const getButtonStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: Theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      paddingHorizontal: Theme.spacing.lg,
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.paddingVertical = Theme.spacing.xs;
        break;
      case 'large':
        baseStyle.paddingVertical = Theme.spacing.md;
        break;
      default: // medium
        baseStyle.paddingVertical = Theme.spacing.sm;
    }

    // Variant styles
    switch (variant) {
      case 'primary':
        baseStyle.backgroundColor = disabled 
          ? '#A5D6A7' 
          : Theme.colors.primary;
        break;
      case 'secondary':
        baseStyle.backgroundColor = disabled 
          ? '#C5E1A5' 
          : Theme.colors.secondary;
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = disabled 
          ? '#A5D6A7' 
          : Theme.colors.primary;
        break;
      case 'text':
        baseStyle.backgroundColor = 'transparent';
        break;
    }

    return baseStyle;
  };

  const getTextStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: Theme.typography.fontSize.md,
      fontWeight: '600',
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.fontSize = Theme.typography.fontSize.sm;
        break;
      case 'large':
        baseStyle.fontSize = Theme.typography.fontSize.lg;
        break;
    }

    // Variant styles
    switch (variant) {
      case 'primary':
      case 'secondary':
        baseStyle.color = '#FFFFFF';
        break;
      case 'outline':
      case 'text':
        baseStyle.color = disabled 
          ? '#9E9E9E' 
          : Theme.colors.primary;
        break;
    }

    if (disabled) {
      baseStyle.opacity = 0.7;
    }

    return baseStyle;
  };

  // Calculate spacing styles separately to avoid type errors
  const getSpacingStyles = (): TextStyle => {
    const spacingStyle: TextStyle = {};
    
    if (leftIcon) {
      spacingStyle.marginLeft = Theme.spacing.sm;
    }
    
    if (rightIcon) {
      spacingStyle.marginRight = Theme.spacing.sm;
    }
    
    return spacingStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' || variant === 'secondary' ? '#FFFFFF' : Theme.colors.primary} 
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text style={[getTextStyles(), getSpacingStyles(), textStyle]}>
            {title}
          </Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
}; 